import * as dotenv from 'dotenv';
import path from 'path';
import Redis from 'ioredis';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testRedis() {
  console.log('--- Testing Redis Connection ---');

  const redisUrl = process.env.UPSTASH_REDIS_URL;
  const redisToken = process.env.UPSTASH_REDIS_TOKEN;

  if (!redisUrl) {
    console.error('❌ UPSTASH_REDIS_URL is missing');
    return;
  }
  if (!redisToken) {
    console.error('❌ UPSTASH_REDIS_TOKEN is missing');
    return;
  }

  console.log(`URL: ${redisUrl}`);
  // Mask token
  console.log(`Token: ${redisToken.substring(0, 4)}...`);

  // Simulate the parsing logic from src/lib/redis-cache.ts
  console.log('\n--- Simulating App Parsing Logic ---');
  try {
    const urlWithoutProtocol = redisUrl.replace(/^https?:\/\//, '');
    const [hostname, portStr] = urlWithoutProtocol.split(':');
    const port = portStr ? parseInt(portStr, 10) : 6379;

    console.log(`Parsed Host: ${hostname}`);
    console.log(`Parsed Port: ${port}`);

    const redisOptions = {
      host: hostname,
      port: port,
      username: 'default',
      password: redisToken,
      tls: {},
      connectTimeout: 5000,
    };

    console.log('Connecting with parsed options...');
    const client = new Redis(redisOptions);

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message);
    });

    await client.set('test-key', 'success');
    const value = await client.get('test-key');
    console.log(`✅ Set/Get Result: ${value}`);

    await client.quit();
  } catch (error) {
    console.error('❌ Parsing/Connection failed:', error);
  }
  
  // Test with standard ioredis URL connection if the above fails or just to compare
  console.log('\n--- Testing Standard Connection String ---');
  try {
      // If the URL is just a hostname, we need to construct a proper redis:// URL
      let connectionString = redisUrl;
      if (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://')) {
          // If it's just a hostname/url from Upstash UI which might be https://...
           // Upstash often gives a REST URL (https) and a Redis URL (rediss). 
           // If the user put the REST URL in UPSTASH_REDIS_URL, ioredis won't like it directly.
           console.log('URL does not start with redis:// or rediss://. It might be a REST URL.');
      }
      
      // We won't try to connect with the raw URL if we suspect it's wrong, 
      // but let's see what happens if we try to use the token as password with the host.
  } catch (e) {
      console.error(e);
  }
}

testRedis();
