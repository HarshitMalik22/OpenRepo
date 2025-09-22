/**
 * Debug utility for environment variables
 * This helps identify issues with environment variable loading on Vercel
 */

export interface EnvDebugInfo {
  clerk: {
    publishableKey: boolean;
    secretKey: boolean;
    publishableKeyPrefix?: string;
    secretKeyPrefix?: string;
  };
  supabase: {
    url: boolean;
    anonKey: boolean;
    serviceRoleKey: boolean;
    urlPrefix?: string;
  };
  database: {
    url: boolean;
    urlPrefix?: string;
  };
  ai: {
    geminiKey: boolean;
    githubToken: boolean;
  };
  nodeEnv: string;
  vercel: {
    isVercel: boolean;
    region?: string;
  };
}

export function getEnvironmentDebugInfo(): EnvDebugInfo {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  const geminiKey = process.env.GEMINI_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;
  
  return {
    clerk: {
      publishableKey: !!clerkPublishableKey,
      secretKey: !!clerkSecretKey,
      publishableKeyPrefix: clerkPublishableKey ? clerkPublishableKey.substring(0, 10) + '...' : undefined,
      secretKeyPrefix: clerkSecretKey ? clerkSecretKey.substring(0, 10) + '...' : undefined,
    },
    supabase: {
      url: !!supabaseUrl,
      anonKey: !!supabaseAnonKey,
      serviceRoleKey: !!supabaseServiceRoleKey,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : undefined,
    },
    database: {
      url: !!databaseUrl,
      urlPrefix: databaseUrl ? databaseUrl.substring(0, 30) + '...' : undefined,
    },
    ai: {
      geminiKey: !!geminiKey,
      githubToken: !!githubToken,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
    vercel: {
      isVercel: !!process.env.VERCEL,
      region: process.env.VERCEL_REGION,
    },
  };
}

export function logEnvironmentDebugInfo() {
  const debugInfo = getEnvironmentDebugInfo();
  
  console.log('=== Environment Debug Info ===');
  console.log('Node Environment:', debugInfo.nodeEnv);
  console.log('Is Vercel:', debugInfo.vercel.isVercel);
  console.log('Vercel Region:', debugInfo.vercel.region);
  
  console.log('\n--- Clerk Configuration ---');
  console.log('Publishable Key:', debugInfo.clerk.publishableKey ? '✅ Present' : '❌ Missing');
  console.log('Secret Key:', debugInfo.clerk.secretKey ? '✅ Present' : '❌ Missing');
  if (debugInfo.clerk.publishableKeyPrefix) {
    console.log('Publishable Key Prefix:', debugInfo.clerk.publishableKeyPrefix);
  }
  
  console.log('\n--- Supabase Configuration ---');
  console.log('URL:', debugInfo.supabase.url ? '✅ Present' : '❌ Missing');
  console.log('Anon Key:', debugInfo.supabase.anonKey ? '✅ Present' : '❌ Missing');
  console.log('Service Role Key:', debugInfo.supabase.serviceRoleKey ? '✅ Present' : '❌ Missing');
  if (debugInfo.supabase.urlPrefix) {
    console.log('URL Prefix:', debugInfo.supabase.urlPrefix);
  }
  
  console.log('\n--- Database Configuration ---');
  console.log('Database URL:', debugInfo.database.url ? '✅ Present' : '❌ Missing');
  if (debugInfo.database.urlPrefix) {
    console.log('Database URL Prefix:', debugInfo.database.urlPrefix);
  }
  
  console.log('\n--- AI Configuration ---');
  console.log('Gemini Key:', debugInfo.ai.geminiKey ? '✅ Present' : '❌ Missing');
  console.log('GitHub Token:', debugInfo.ai.githubToken ? '✅ Present' : '❌ Missing');
  
  console.log('\n=== End Environment Debug Info ===');
  
  return debugInfo;
}
