import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestSupabaseConnection = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');

    try {
      // Dynamically import the supabase client to avoid SSR issues
      const { supabase } = await import('../services/supabaseClient');

      // Test authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setTestResult(`Supabase session error: ${sessionError.message}`);
        setIsLoading(false);
        return;
      }
      
      let result = `Supabase session: ${session ? 'Active' : 'None'}\n`;
      
      // Test database connection by querying a table (if exists)
      const { data, error } = await supabase
        .from('blood_requests')
        .select('id')
        .limit(1);
      
      if (error && error.message !== 'The resource was not found') {
        setTestResult(result + `Supabase database error: ${error.message}`);
        setIsLoading(false);
        return;
      }
      
      setTestResult(result + `Supabase connection successful!\nSample data query result: ${JSON.stringify(data)}`);
    } catch (error) {
      setTestResult(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
        {testResult && (
          <div className="p-4 bg-muted rounded">
            <pre className="whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestSupabaseConnection;