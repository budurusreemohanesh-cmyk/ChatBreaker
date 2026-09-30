import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-4">
      <h1 className="font-serif text-5xl font-bold text-neutral-900">404</h1>
      <p className="text-sm text-neutral-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
