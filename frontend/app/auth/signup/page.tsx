"use client"

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignupPage = () => {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [isAuthenticated,setIsAuthenticated]=useState(false)
  const [error, setError] = useState("");
  const router=useRouter()
  
  const handleSignup=async(e: React.FormEvent)=>{
    e.preventDefault()

    try {
      const response = await axios.post('https://task-management-be-o3vs.onrender.com/api/auth/signup', { email, password });
      const token = response.data.token;
      setError("");
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    
    } catch (error:any) {
      
      // const errMsg=error.response?.data?.msg + " " + error.response?.data?.errors[0]?.path[0] + " "+error.response?.data?.errors[0]?.code

      // console.log(errMsg);
      
      
      setError('Invalid email/password or account already exists or password is short ');
    }
    
  }
  useEffect(()=>{

    if(isAuthenticated){
      console.log("change");
      
      router.push('https://task-management-app-alpha-livid.vercel.app/dashboard')
    }

  },[isAuthenticated,router])
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Sign Up</h2>

         {/* Show error message if it exists */}
         {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <Input type="email" placeholder="Email" className="w-full" onChange={(e)=>{setEmail(e.target.value)}} />
          </div>
          <div className="mb-6">
            <Input type="password" placeholder="Password" className="w-full" onChange={(e)=>{setPassword(e.target.value)}} />
          </div>

          <Button type="submit" className="w-full" variant="success">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;



