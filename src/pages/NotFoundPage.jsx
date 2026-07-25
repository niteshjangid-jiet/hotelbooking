import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { HiHome } from 'react-icons/hi';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-16">
      <div className="relative">
        <span className="text-9xl font-black text-slate-200 tracking-widest select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">Destination Not Found</span>
        </div>
      </div>

      <p className="mt-4 text-base text-slate-600 max-w-md">
        The page or luxury stay you are looking for might have been moved or doesn't exist.
      </p>

      <Link to="/" className="mt-8">
        <Button variant="primary" size="lg" icon={HiHome} className="font-bold">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
