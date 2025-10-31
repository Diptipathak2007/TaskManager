import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 p-8">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <UserButton afterSignOutUrl="/" />
          </header>
          <p className="text-lg">Welcome to your dashboard! 🎉</p>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
