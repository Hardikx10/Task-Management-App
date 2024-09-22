
"use client"

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [isAuthenticated,setIsAuthenticated]=useState(false)
  const [error, setError] = useState("");
  const router=useRouter()
  
  const handleLogin=async(e: React.FormEvent)=>{
    e.preventDefault()

    try {
      const response = await axios.post('https://task-be-f76c73db93ff.herokuapp.com/api/auth/login', { email, password });
      const token = response.data.token;
      setError("");
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    
    } catch (error:any) {
      
      // const errMsg=error.response?.data?.msg + " " + error.response?.data?.errors[0].path[0] + " "+error.response?.data?.errors[0].code

      // console.log(errMsg);
      
      
      setError('Incorrect email/password');
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
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Show error message if it exists */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input type="email" placeholder="Email" className="w-full" onChange={(e)=>{setEmail(e.target.value)}} />
          </div>
          <div className="mb-6">
            <Input type="password" placeholder="Password" className="w-full" onChange={(e)=>{setPassword(e.target.value)}} />
          </div>

          <Button type="submit" className="w-full" variant="primary">
            Log In
          </Button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
