import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="container mx-auto py-24 flex items-center justify-center">
      <SignIn />
    </div>
  );
}