import { SignUp } from "@clerk/clerk-react";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <SignUp path="/signup" routing="path" signInUrl="/signin" />
    </div>
  );
}
