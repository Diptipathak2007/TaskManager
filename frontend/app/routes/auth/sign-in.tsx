import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type SigninFormData = z.infer<typeof signInSchema>;

const Signin = () => {
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const handleOnSubmit = (value: SigninFormData) => {
    console.log(value);
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-sky-50 via-blue-50 to-sky-100 p-4'>
      <Card className='max-w-md w-full shadow-2xl border border-sky-200 bg-white/95 backdrop-blur-sm'>
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-sky-700">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@example.com" 
                        {...field}
                        className="h-11 border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-all"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        className="h-11 border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-all"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type='submit' 
                className='w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg shadow-sky-200 transition-all duration-200 hover:shadow-xl hover:shadow-sky-300'
              >
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center pb-6 pt-2">
          <div className="text-sm text-slate-600">
            Don't have an account? <a href="/signup" className='text-sky-600 hover:text-sky-700 underline underline-offset-2 font-medium transition-colors'>Sign Up</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;