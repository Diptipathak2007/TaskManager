import { SignIn } from "@clerk/clerk-react";

export default function SigninPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
}
