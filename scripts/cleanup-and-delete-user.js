#!/usr/bin/env node
/**
 * cleanup-and-delete-user.js
 *
 * Usage:
 *   node scripts/cleanup-and-delete-user.js <USER_UUID> [--yes] [--extra table:column,table:column]
 *
 * This script will:
 *  - Read SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_*) from env
 *  - Delete rows from a few common tables that reference auth.users
 *  - Call Supabase Admin API to delete the auth user
 *
 * WARNING: This is destructive. Run with care and make backups if needed.
 */

import('dotenv/config');
import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('Usage: node scripts/cleanup-and-delete-user.js <USER_UUID> [--yes] [--extra table:column,table:column]');
  process.exit(1);
}

const userId = args[0];
const yes = args.includes('--yes');
const extraArg = args.find(a => a.startsWith('--extra'));
let extraPairs = [];
if (extraArg) {
  const m = extraArg.split('=');
  if (m[1]) extraPairs = m[1].split(',').map(p => p.split(':'));
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const commonTargets = [
  { table: 'donors', column: 'created_by' },
  { table: 'blood_requests', column: 'created_by' },
  { table: 'user_profiles', column: 'id' },
];

async function deleteFromTable(table, column) {
  try {
    const { data, error } = await supabase.from(table).delete().eq(column, userId).select('*');
    if (error) {
      console.warn(`Warning: delete from ${table}.${column} failed:`, error.message || error);
      return { table, column, error };
    }
    return { table, column, deleted: data?.length ?? 0 };
  } catch (err) {
    return { table, column, error: String(err) };
  }
}

async function main() {
  console.log('Preparing to delete dependent rows for user:', userId);

  const extras = extraPairs.map(([t, c]) => ({ table: t, column: c }));
  const targets = [...commonTargets, ...extras];

  console.log('Targets:', targets.map(t => `${t.table}.${t.column}`).join(', '));

  if (!yes) {
    console.log('\nThis will permanently delete rows from the above tables. Re-run with --yes to proceed.');
    process.exit(0);
  }

  for (const t of targets) {
    const res = await deleteFromTable(t.table, t.column);
    if (res.error) console.error(`Failed ${t.table}:`, res.error);
    else console.log(`Deleted ${res.deleted ?? 0} rows from ${t.table}.${t.column}`);
  }

  try {
    console.log('Deleting auth user via Admin API...');
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.error('Failed to delete user via Admin API:', error.message || error);
      process.exit(1);
    }
    console.log('Auth user deleted successfully.');
  } catch (err) {
    console.error('Error calling admin.deleteUser:', err);
    process.exit(1);
  }
}

main();
