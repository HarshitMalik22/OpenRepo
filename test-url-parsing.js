// Test URL parsing functionality
function extractRepoFromUrl(url) {
  // Remove trailing slashes and whitespace
  const cleanUrl = url.trim().replace(/\/$/, '');
  
  // Handle various GitHub URL formats
  const patterns = [
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/\?#]+)/i,
    /^github\.com\/([^\/]+)\/([^\/\?#]+)/i,
    /^([^\/]+)\/([^\/\?#]+)$/  // Simple owner/repo format
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) {
      const owner = match[1];
      const repo = match[2];
      // Remove .git extension if present
      const repoName = repo.replace(/\.git$/, '');
      return `${owner}/${repoName}`;
    }
  }
  
  return null;
}

// Test cases
const testUrls = [
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js',
  'vercel/next.js',
  'https://github.com/facebook/react.git',
  'github.com/facebook/react',
  'https://github.com/tailwindlabs/tailwindcss'
];

console.log('Testing URL parsing:');
testUrls.forEach(url => {
  const result = extractRepoFromUrl(url);
  console.log(`Input: "${url}" -> Output: "${result}"`);
  
  if (result) {
    const slug = result.replace('/', '--');
    const decodedSlug = decodeURIComponent(slug).replace('--', '/');
    console.log(`  Slug: "${slug}" -> Decoded: "${decodedSlug}"`);
  }
  console.log('---');
});
