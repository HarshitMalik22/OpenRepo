import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseAdminClient: ReturnType<typeof createClient> | null = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Storage functionality will be disabled.')
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase service role key is not configured. Administrative operations will be disabled.')
} else {
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey)
}

export const supabase = supabaseClient
export const supabaseAdmin = supabaseAdminClient

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  REPOSITORY_IMAGES: 'repository-images',
  USER_UPLOADS: 'user-uploads',
  AI_ANALYSIS_IMAGES: 'ai-analysis-images',
} as const

export type StorageBucket = keyof typeof STORAGE_BUCKETS

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  options?: {
    upsert?: boolean
    metadata?: Record<string, any>
  }
) {
  if (!supabase) {
    throw new Error('Supabase storage is not configured. Please check your environment variables.')
  }
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? false,
        metadata: options?.metadata,
      })

    if (error) {
      console.error('Error uploading file:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in uploadFile:', error)
    throw error
  }
}

/**
 * Get a public URL for a file
 */
export async function getPublicUrl(bucket: StorageBucket, path: string) {
  if (!supabase) {
    throw new Error('Supabase storage is not configured. Please check your environment variables.')
  }
  
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (error) {
    console.error('Error in getPublicUrl:', error)
    return null
  }
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFile(bucket: StorageBucket, path: string) {
  if (!supabase) {
    throw new Error('Supabase storage is not configured. Please check your environment variables.')
  }
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteFile:', error)
    throw error
  }
}

/**
 * List files in a bucket with optional prefix
 */
export async function listFiles(
  bucket: StorageBucket,
  options?: {
    prefix?: string
    limit?: number
    offset?: number
  }
) {
  if (!supabase) {
    throw new Error('Supabase storage is not configured. Please check your environment variables.')
  }
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(options?.prefix, {
        limit: options?.limit,
        offset: options?.offset,
      })

    if (error) {
      console.error('Error listing files:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in listFiles:', error)
    throw error
  }
}

/**
 * Upload a user avatar
 */
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`
  
  return uploadFile(STORAGE_BUCKETS.AVATARS, fileName, file, {
    upsert: true,
    metadata: {
      userId,
      type: 'avatar',
      uploadedAt: new Date().toISOString(),
    },
  })
}

/**
 * Get user avatar URL
 */
export function getAvatarUrl(userId: string, fileName?: string) {
  const path = fileName ? `${userId}/${fileName}` : `${userId}/avatar`
  return getPublicUrl(STORAGE_BUCKETS.AVATARS, path)
}

/**
 * Upload repository image
 */
export async function uploadRepositoryImage(
  repositoryFullName: string,
  file: File,
  type: 'screenshot' | 'logo' | 'diagram' = 'screenshot'
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${repositoryFullName.replace('/', '_')}/${type}-${Date.now()}.${fileExt}`
  
  return uploadFile(STORAGE_BUCKETS.REPOSITORY_IMAGES, fileName, file, {
    metadata: {
      repository: repositoryFullName,
      type,
      uploadedAt: new Date().toISOString(),
    },
  })
}

/**
 * Get repository image URLs
 */
export function getRepositoryImageUrl(repositoryFullName: string, fileName: string) {
  const path = `${repositoryFullName.replace('/', '_')}/${fileName}`
  return getPublicUrl(STORAGE_BUCKETS.REPOSITORY_IMAGES, path)
}

/**
 * Upload AI analysis image (flowcharts, diagrams, etc.)
 */
export async function uploadAiAnalysisImage(
  analysisId: string,
  file: File,
  type: 'flowchart' | 'diagram' | 'visualization' = 'flowchart'
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${analysisId}/${type}-${Date.now()}.${fileExt}`
  
  return uploadFile(STORAGE_BUCKETS.AI_ANALYSIS_IMAGES, fileName, file, {
    metadata: {
      analysisId,
      type,
      uploadedAt: new Date().toISOString(),
    },
  })
}

/**
 * Get AI analysis image URL
 */
export function getAiAnalysisImageUrl(analysisId: string, fileName: string) {
  const path = `${analysisId}/${fileName}`
  return getPublicUrl(STORAGE_BUCKETS.AI_ANALYSIS_IMAGES, path)
}

/**
 * Initialize storage buckets (should be called once during setup)
 */
export async function initializeStorageBuckets() {
  if (!supabaseAdmin) {
    console.error('Supabase admin client is not configured. Cannot initialize buckets.')
    return
  }
  
  const buckets = Object.values(STORAGE_BUCKETS)
  
  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data: bucketsData, error: listError } = await supabaseAdmin.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        continue
      }

      const bucketExists = bucketsData?.some(b => b.name === bucket)
      
      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
          public: bucket !== STORAGE_BUCKETS.USER_UPLOADS, // Make user uploads private
          fileSizeLimit: 52428800, // 50MB limit
        })

        if (createError) {
          console.error(`Error creating bucket ${bucket}:`, createError)
        } else {
          console.log(`Created bucket: ${bucket}`)
        }
      }
    } catch (error) {
      console.error(`Error initializing bucket ${bucket}:`, error)
    }
  }
}

/**
 * Check if Supabase storage is configured
 */
export function isStorageConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}
