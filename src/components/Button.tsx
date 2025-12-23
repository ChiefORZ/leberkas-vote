import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Spinner } from '@/components/Spinner';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-brand-100 dark:data-[state=open]:bg-brand-800 dark:focus:ring-brand-400 dark:focus:ring-offset-brand-900 dark:hover:bg-brand-800 dark:hover:text-brand-100',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
        sm: 'h-9 rounded-md px-2',
      },
      variant: {
        default:
          'bg-brand-900 text-white hover:bg-brand-700 dark:bg-brand-50 dark:text-brand-900',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        ghost:
          'bg-transparent hover:bg-brand-100 data-[state=open]:bg-transparent dark:text-brand-100 dark:data-[state=open]:bg-transparent dark:hover:bg-brand-800 dark:hover:text-brand-100',
        link: 'bg-transparent text-brand-900 underline-offset-4 hover:bg-transparent hover:underline dark:text-brand-100 dark:hover:bg-transparent',
        outline:
          'border border-brand-300 bg-transparent hover:bg-brand-200 dark:border-brand-700 dark:text-brand-100',
        subtle:
          'bg-brand-100 text-brand-900 hover:bg-brand-200 dark:bg-brand-700 dark:text-brand-100',
      },
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, loading, size, ...props }, ref) => {
    const _onClick = React.useCallback(
      (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (loading) {
          return;
        }
        props.onClick?.(evt);
      },
      [loading, props?.onClick]
    );
    return (
      <button
        className={cn(buttonVariants({ className, size, variant }))}
        disabled={loading}
        onClick={_onClick}
        ref={ref}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);
Button.displayName = 'Button';
