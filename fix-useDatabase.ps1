# PowerShell script to fix console.log statements in useDatabase.ts

$file = "src/hooks/useDatabase.ts"
$content = Get-Content $file -Raw

# Add logger import after supabase import
$content = $content -replace "import { useState, useEffect } from 'react'", "import { useState, useEffect, useMemo } from 'react'"
$content = $content -replace "(import { supabase } from '@/services/supabaseClient')", "`$1`nimport { logger } from '@/lib/logger'"

# Replace all console.log with logger.debug in useDonors function
$content = $content -replace "console\.log\('🔴 Setting up real-time subscription for donors table'\)", "logger.debug('🔴 Setting up real-time subscription for donors table')"
$content = $content -replace "console\.log\('🔴 Real-time update received:', payload\)", "logger.debug('🔴 Real-time update received:', payload)"
$content = $content -replace "console\.log\('➕ New donor added:', payload\.new\)", "logger.debug('➕ New donor added:', payload.new)"
$content = $content -replace "console\.log\('✏️ Donor updated:', payload\.new\)", "logger.debug('✏️ Donor updated:', payload.new)"
$content = $content -replace "console\.log\('🗑️ Donor deleted:', payload\.old\)", "logger.debug('🗑️ Donor deleted:', payload.old)"
$content = $content -replace "console\.log\('🔴 Subscription status:', status\)", "logger.debug('🔴 Subscription status:', status)"
$content = $content -replace "console\.log\('🔴 Cleaning up real-time subscription'\)", "logger.debug('🔴 Cleaning up real-time subscription')"

# Save the file
Set-Content $file $content -NoNewline

Write-Host "✅ Fixed useDatabase.ts" -ForegroundColor Green
