import { SignupForm } from '@/components/auth/signup-form'

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <SignupForm />
      </div>
    </div>
  )
}
