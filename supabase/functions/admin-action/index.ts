import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, resourceType, resourceId, data: actionData } = await req.json();

    let result;
    let auditDetails: any = {};

    switch (action) {
      case 'DELETE_BLOOD_REQUEST':
        const { error: deleteRequestError } = await supabaseAdmin
          .from('blood_requests')
          .delete()
          .eq('id', resourceId);
        
        if (deleteRequestError) throw deleteRequestError;
        auditDetails = { blood_request_id: resourceId };
        result = { message: 'Blood request deleted successfully' };
        break;

      case 'DELETE_DONOR':
        const { error: deleteDonorError } = await supabaseAdmin
          .from('donors')
          .delete()
          .eq('id', resourceId);
        
        if (deleteDonorError) throw deleteDonorError;
        auditDetails = { donor_id: resourceId };
        result = { message: 'Donor deleted successfully' };
        break;

      case 'UPDATE_BLOOD_REQUEST_STATUS':
        const { error: updateRequestError } = await supabaseAdmin
          .from('blood_requests')
          .update({ status: actionData.status })
          .eq('id', resourceId);
        
        if (updateRequestError) throw updateRequestError;
        auditDetails = { blood_request_id: resourceId, new_status: actionData.status };
        result = { message: 'Blood request status updated' };
        break;

      case 'TOGGLE_DONOR_AVAILABILITY':
        const { error: toggleError } = await supabaseAdmin
          .from('donors')
          .update({ is_available: actionData.is_available })
          .eq('id', resourceId);
        
        if (toggleError) throw toggleError;
        auditDetails = { donor_id: resourceId, is_available: actionData.is_available };
        result = { message: 'Donor availability updated' };
        break;

      case 'GRANT_ROLE':
        const { error: grantError } = await supabaseAdmin
          .from('user_roles')
          .upsert({ user_id: resourceId, role: actionData.role });
        
        if (grantError) throw grantError;
        auditDetails = { user_id: resourceId, role: actionData.role };
        result = { message: `Role ${actionData.role} granted successfully` };
        break;

      case 'REVOKE_ROLE':
        const { error: revokeError } = await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', resourceId)
          .eq('role', actionData.role);
        
        if (revokeError) throw revokeError;
        auditDetails = { user_id: resourceId, role: actionData.role };
        result = { message: `Role ${actionData.role} revoked successfully` };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Log the action
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: user.id,
      actor_email: user.email,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: auditDetails
    });

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Admin action error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
