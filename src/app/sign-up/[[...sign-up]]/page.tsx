import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-24 flex items-center justify-center">
      <SignUp />
    </div>
  );
}