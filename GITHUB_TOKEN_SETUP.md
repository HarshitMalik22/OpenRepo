# GitHub Token Setup for OpenSauce

## Why You Need a GitHub Token

The GitHub API has strict rate limits for unauthenticated requests:
- **Without token**: 60 requests per hour
- **With token**: 5,000 requests per hour

Without a GitHub token, you'll quickly hit rate limits and get very few repositories (1-2 instead of 20+).

## How to Get a GitHub Token

1. Go to [GitHub Developer Settings](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Fill in the form:
   - **Note**: `OpenSauce App`
   - **Expiration**: Choose 90 days or no expiration
   - **Scopes**: Check the following boxes:
     - `public_repo` - Access to public repositories
     - `repo:status` - Access to commit status
     - `read:user` - Read user profile data
4. Click "Generate token"
5. **Copy the token immediately** - you won't be able to see it again!

## How to Add the Token to Your Environment

### Option 1: Add to .env file (Recommended)

Create or edit the `.env` file in your project root:

```bash
# Add this line to your .env file
GITHUB_TOKEN=ghp_your_token_here
```

Replace `ghp_your_token_here` with your actual GitHub token.

### Option 2: Add to System Environment

```bash
# For macOS/Linux
export GITHUB_TOKEN=ghp_your_token_here

# For Windows (Command Prompt)
set GITHUB_TOKEN=ghp_your_token_here

# For Windows (PowerShell)
$env:GITHUB_TOKEN="ghp_your_token_here"
```

## Verify Your Token is Working

1. Restart your development server
2. Check the browser console for GitHub API logs
3. You should see higher rate limits and more repositories

## Troubleshooting

### Still Getting Rate Limited?

1. **Check your token is valid**: Tokens can expire or be revoked
2. **Verify the token is set**: Check that `GITHUB_TOKEN` is in your environment
3. **Restart your server**: Environment variables are loaded at startup

### Token Not Working?

1. Make sure you have the correct scopes (`public_repo`, `repo:status`, `read:user`)
2. Check for typos in the token
3. Generate a new token if needed

## Security Notes

- **Never commit your `.env` file** to Git
- **Never share your GitHub token** publicly
- **Use environment-specific tokens** for production vs development
- **Rotate tokens regularly** for security

## Expected Results

With a proper GitHub token, you should see:
- **More repositories**: 20+ instead of 1-2
- **Better filtering**: More accurate tech stack matching
- **No rate limit errors**: Smooth API interactions
- **Faster loading**: Cached responses work better
