'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Check if the reset password link is valid
    const checkResetLink = async () => {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: searchParams?.get('token_hash') || '',
          type: 'recovery',
        })
        
        if (error || !data) {
          setIsValidLink(false)
          toast.error('Invalid or expired reset link')
        } else {
          setIsValidLink(true)
        }
      } catch (error) {
        setIsValidLink(false)
        toast.error('Error validating reset link')
      }
    }

    if (searchParams?.has('token_hash')) {
      checkResetLink()
    } else {
      setIsValidLink(false)
      toast.error('Invalid reset link')
    }
  }, [searchParams, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error
      
      toast.success('Password updated successfully!')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidLink === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isValidLink) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Icons.alertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold">Invalid or Expired Link</h2>
        <p className="text-muted-foreground">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Button onClick={() => router.push('/forgot-password')} className="mt-4">
          Request New Link
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password below.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  )
}
