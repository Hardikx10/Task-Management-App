import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'text-white hover:bg-red-700',
        success: 'border border-input bg-green-600 text-white hover:bg-green-700',
        outline: 'border border-input bg-accent text-black hover:bg-gray-300',
        ghost: 'bg-transparent text-black hover:bg-gray-300',
      },
      size: {
        sm: 'h-10 px-4 text-base',  // Small button
        default: 'h-12 py-3 px-6 text-lg', // Default button
        lg: 'h-14 px-8 text-xl',  // Large button
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

