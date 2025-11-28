import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              card: 'bg-card border border-border shadow-lg',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'border-border hover:bg-accent',
              socialButtonsBlockButtonText: 'text-foreground',
              dividerText: 'text-muted-foreground',
              formFieldLabel: 'text-foreground',
              formFieldInput: 'border-border bg-background text-foreground',
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              footerActionText: 'text-muted-foreground',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
          afterSignInUrl="/"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  )
}
