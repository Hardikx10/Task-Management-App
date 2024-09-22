import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-600 to-purple-800 text-white">
      <h1 className="text-5xl font-extrabold mb-6">Task Manager</h1>
      <p className="text-lg mb-8">Streamline your workflow and stay organized!</p>

      <div className="flex space-x-6">
        <Link href="/auth/login">
          <Button variant="primary" size="default" className="px-6 py-3">
            Login
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="outline" size="default" className="px-6 py-3">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

