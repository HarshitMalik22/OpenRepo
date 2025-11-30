import 'dotenv/config';
import { createAdminClient } from '../src/lib/supabase/server';

async function main() {
  console.log('Starting repository save test...');
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const supabase = await createAdminClient();
    
    const testRepo = {
      id: 123456789, // Dummy ID
      full_name: 'test/repo',
      data: { description: 'Test repository' },
      last_analyzed: new Date().toISOString()
    };

    console.log('Attempting to upsert test repository:', testRepo.full_name);

    const { error } = await supabase
      .from('repositories')
      .upsert(testRepo, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert failed:', error);
      process.exit(1);
    }

    console.log('Repository saved successfully.');
    
    // Verify by reading it back
    const { data, error: readError } = await supabase
      .from('repositories')
      .select('*')
      .eq('id', testRepo.id)
      .single();

    if (readError) {
      console.error('Failed to read back repository:', readError);
    } else {
      console.log('Read back repository:', data);
    }

  } catch (error) {
    console.error('Test failed with exception:', error);
    process.exit(1);
  }
}

main();
