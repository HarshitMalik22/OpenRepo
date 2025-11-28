import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('URL:', url ? 'Defined' : 'Undefined');
  console.log('Key:', key ? 'Defined' : 'Undefined');

  if (!url || !key) {
    console.error('Missing credentials');
    return;
  }

  console.log('Connecting to:', url);

  const supabase = createClient(url, key);

  try {
    const { count, error } = await supabase.from('repositories').select('*', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Success! Connection working. Count:', count);
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}

main();
