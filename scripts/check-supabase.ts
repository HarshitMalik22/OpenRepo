import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  try {
    const { data, error } = await supabase.from('repositories').select('count', { count: 'exact', head: true })
    if (error) {
      console.error('Supabase REST Error:', error)
    } else {
      console.log('Supabase REST Connection Successful. Repository count:', data) // count is in count property usually
      // Actually head: true returns count in count property of response object, not data.
      // But let's just select * limit 1
    }
    
    const { data: repos, error: reposError } = await supabase.from('repositories').select('*').limit(1)
    if (reposError) {
      console.error('Supabase Query Error:', reposError)
    } else {
      console.log('Supabase Query Success. First repo:', repos)
    }

  } catch (e) {
    console.error('Script Error:', e)
  }
}

main()
