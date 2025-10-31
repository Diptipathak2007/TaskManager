"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

/* --------------------------- Navbar Component --------------------------- */
function Navbar() {
  return (
    <motion.nav
      className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h1 className="text-2xl font-bold text-blue-600">TaskHub</h1>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              Signup
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </motion.nav>
  );
}

/* -------------------------- Landing Page Body --------------------------- */
export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-900 via-purple-900 to-black text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-28 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-violet-400"
        >
          Organize. Collaborate. Build.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Your ultimate project management platform to streamline tasks, boost team productivity, and hit deadlines on time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex justify-center gap-4"
        >
          <SignUpButton mode="modal">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white font-semibold">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpButton>

          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="border-white text-white">
              Log In
            </Button>
          </SignInButton>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/40 backdrop-blur-md">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 md:px-20">
          {[
            {
              title: "Task Automation",
              desc: "Automate workflows and let your team focus on what matters most.",
            },
            {
              title: "Real-Time Collaboration",
              desc: "Communicate, share updates, and manage progress instantly.",
            },
            {
              title: "Analytics Dashboard",
              desc: "Track progress with insightful charts and smart reporting tools.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 rounded-2xl p-6 shadow-xl border border-white/10"
            >
              <CardHeader>
                <CardTitle className="text-2xl mb-2 text-pink-400">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.desc}</p>
              </CardContent>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-linear-to-b from-black via-indigo-950 to-purple-950 text-center">
        <h2 className="text-4xl font-bold mb-12">Simple Pricing</h2>
        <div className="flex flex-wrap justify-center gap-8 px-6">
          {[
            {
              plan: "Free",
              price: "$0",
              features: ["Up to 3 projects", "5 team members", "Basic support"],
            },
            {
              plan: "Pro",
              price: "$12/mo",
              features: ["Unlimited projects", "15 team members", "Priority support"],
            },
            {
              plan: "Enterprise",
              price: "Custom",
              features: ["Unlimited everything", "Dedicated manager", "Custom integrations"],
            },
          ].map((tier, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 rounded-2xl p-8 w-80 shadow-lg border border-white/10"
            >
              <h3 className="text-2xl font-semibold text-pink-400 mb-2">{tier.plan}</h3>
              <p className="text-4xl font-bold mb-4">{tier.price}</p>
              <ul className="space-y-2 text-gray-300 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full">
                Choose Plan
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-8 bg-black/60 backdrop-blur-lg text-center">
        <h2 className="text-4xl font-bold mb-6">About Us</h2>
        <p className="max-w-2xl mx-auto text-gray-300 leading-relaxed">
          Project Manager is built by a passionate team of developers and designers who believe
          in creating simple, powerful tools for collaboration and productivity. Join thousands
          of teams making their workflow seamless and efficient.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10 text-gray-400 text-sm">
        © {new Date().getFullYear()} Project Manager. All rights reserved.
      </footer>
    </div>
  );
}
