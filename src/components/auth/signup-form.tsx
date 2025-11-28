'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        // Create user profile in the database
        const { error: profileError } = await supabase
          .from('user_profiles')
          // @ts-expect-error
          .insert([
            {
              user_id: data.user.id,
              bio: null,
              github_username: null,
              experience_level: null,
              tech_interests: [],
            }
          ])

        if (profileError) throw profileError

        toast.success('Check your email for the confirmation link!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const searchParams = useSearchParams()
  const next = searchParams?.get('next') || '/dashboard'

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider === 'google' ? 'Google' : 'GitHub'}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign up to start exploring repositories
        </p>
      </div>
      
      <div className="grid gap-4">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleOAuthSignIn('google')}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" width="24" height="24">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.24426 56.479 -10.4643 57.329 L -10.4643 60.609 L -6.02426 60.609 C -4.56426 58.389 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.71426 60.609 L -10.4643 57.329 C -11.4643 58.049 -12.7443 58.489 -14.0043 58.489 C -16.9543 58.489 -19.3643 56.399 -20.1543 53.629 L -24.7143 53.629 L -24.7143 57.029 C -22.6943 61.019 -19.1343 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -20.1543 53.629 C -20.4543 52.709 -20.6143 51.729 -20.6143 50.719 C -20.6143 49.709 -20.4543 48.729 -20.1243 47.809 L -20.1243 44.409 L -24.6843 44.409 C -25.7943 46.599 -26.3343 49.049 -26.3343 51.509 C -26.3343 53.969 -25.7943 56.419 -24.6843 58.609 L -20.1543 53.629 Z"/>
              <path fill="#EA4335" d="M -14.754 44.739 C -12.984 44.739 -11.3543 45.349 -10.0243 46.549 L -6.52426 43.109 C -8.98426 40.809 -12.6843 40.229 -14.754 42.109 C -16.8243 39.999 -19.9443 39.999 -22.0143 42.109 L -25.5243 38.629 C -28.4943 35.779 -33.2043 36.479 -35.1543 40.269 C -37.0943 44.059 -34.4643 48.729 -30.5343 49.709 C -32.3443 51.029 -33.1743 53.159 -32.9343 55.359 C -32.6943 57.559 -31.1043 59.419 -28.9543 60.119 C -26.8043 60.819 -24.4543 60.199 -22.7943 58.419 L -14.754 50.719 L -14.754 44.739 Z"/>
            </g>
          </svg>
          Continue with Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleOAuthSignIn('github')}
          className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white border-transparent hover:border-transparent"
        >
          <Icons.github className="h-4 w-4 mr-2" />
          Continue with GitHub
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Or sign up with email
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              {password.length > 0 && password.length < 6 && (
                <span className="text-xs text-amber-500">
                  Min 6 characters
                </span>
              )}
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || password.length < 6} 
            className="w-full mt-2 h-10"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </div>
      </form>
    </div>
  )
}
