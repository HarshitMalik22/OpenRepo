# Supabase Setup Guide for OpenSauce

## Clerk + Supabase Storage Configuration

This setup guide is for using **Clerk for authentication** and **Supabase for storage only**.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project" 
4. Fill in the project details:
   - **Project Name**: `opensauce-app` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Get Database Connection String

1. Once your project is created, go to **Project Settings** > **Database**
2. Find the **Connection string** section
3. Copy the **URI** connection string
4. Replace `[YOUR-PASSWORD]` with your actual database password

Your connection string should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Step 3: Update Environment Variables

Create or update your `.env` file with the following:

```env
# Database - Prisma with PostgreSQL
SUPABASE_DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Storage (for file uploads, images, etc.)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Clerk Authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
```

## Step 4: Generate Prisma Client

Run this command to generate the Prisma client:

```bash
npx prisma generate
```

## Step 5: Push Database Schema

Run this command to create the tables in your Supabase database:

```bash
npx prisma db push
```

## Why This Configuration is Best

**Using Clerk + Supabase Storage is the best approach because:**

1. **🔐 Clerk is Best-in-Class for Auth** - Superior authentication, user management, and security
2. **📦 Supabase Storage is Excellent** - Perfect for file uploads, images, and media storage
3. **🚀 Separation of Concerns** - Clean separation between auth and storage concerns
4. **⚡ Performance** - Both services are optimized for their specific use cases
5. **🛡️ Security** - Clerk provides robust security features while Supabase handles storage securely
6. **📈 Scalability** - Both services scale independently based on your needs

## Architecture Overview

```
Frontend (Next.js)
├── Clerk Authentication
│   ├── User sign up/sign in
│   ├── Session management
│   └── User profile management
├── Supabase Storage
│   ├── File uploads
│   ├── Image storage
│   └── Media management
└── Prisma Database
    ├── User profiles (linked to Clerk user ID)
    ├── Repository data
    ├── User interactions
    └── AI analysis cache
```

## Step 6: Verify Setup

To verify everything is working, run:

```bash
npx prisma studio
```

This will open Prisma Studio where you can view and manage your database tables.

## Step 7: Install Supabase Client for Storage

Since you're using Supabase for storage only, install the client:

```bash
npm install @supabase/supabase-js
```

## Database Schema Overview

The following tables will be created in your Supabase database:

- **users** - User profiles (linked to Clerk user ID via external ID)
- **user_profiles** - Extended user preferences and learning data
- **repositories** - GitHub repository information
- **user_interactions** - User activity tracking
- **user_preferences** - Recommendation preferences
- **saved_repositories** - User bookmarked repos
- **ai_analyses** - Cached AI analysis results
- **recommendation_cache** - Performance optimization cache
- **system_config** - Application configuration

**Note:** The `users` table will store user profile data but authentication is handled entirely by Clerk.

## Security Notes

1. **Never commit your `.env` file** to version control
2. **Use strong passwords** for your database
3. **Enable Row Level Security (RLS)** in Supabase for production
4. **Use environment variables** for all sensitive data

## Troubleshooting

If you encounter connection issues:

1. Check that your DATABASE_URL is correct
2. Verify your database password
3. Ensure your project is active in Supabase
4. Check if you need to enable connection pooling in Supabase settings

For more information, visit:
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
