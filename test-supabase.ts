import { supabase, isStorageConfigured, initializeStorageBuckets } from './src/lib/supabase-storage'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Configuration...')
  
  // Test 1: Check if storage is configured
  console.log('\n1. Checking storage configuration...')
  const configured = isStorageConfigured()
  console.log(`Storage configured: ${configured ? '✅ Yes' : '❌ No'}`)
  
  if (!configured) {
    console.error('❌ Supabase environment variables are not properly configured')
    return false
  }
  
  // Test 2: Test basic connection
  console.log('\n2. Testing basic connection...')
  if (!supabase) {
    console.error('❌ Supabase client is not configured')
    return false
  }
  
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Database connection error:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful!')
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
  
  // Test 3: Test storage buckets
  console.log('\n3. Testing storage buckets...')
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('❌ Storage buckets error:', error.message)
      return false
    }
    
    console.log(`✅ Storage accessible! Found ${buckets?.length || 0} existing buckets`)
    console.log('Existing buckets:', buckets?.map(b => b.name).join(', ') || 'None')
    
    // Initialize our buckets
    console.log('\n4. Initializing storage buckets...')
    await initializeStorageBuckets()
    console.log('✅ Storage buckets initialized!')
    
  } catch (error) {
    console.error('❌ Storage test failed:', error)
    return false
  }
  
  console.log('\n🎉 All tests passed! Supabase is properly configured.')
  return true
}

// Run the test
testSupabaseConnection().catch(console.error)
