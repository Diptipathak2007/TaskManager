import React from 'react';
import type { Route } from '../../+types/root';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taskify" },
    { name: "description", content: "Welcome to Taskify!" },
  ];
}
    
const home = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-4">
      <Link to="/Signin">
        <Button className='bg-blue-500 text-white'>Login</Button>
      </Link>
      <Link to="/Signup">
        <Button variant='outline' className='bg-blue-500 text-white'>Signup</Button>
      </Link>
      
    </div>
  )
}

export default home