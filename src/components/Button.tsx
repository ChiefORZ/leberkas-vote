import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { Spinner } from '@/components/Spinner';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:hover:bg-brand-800 dark:hover:text-brand-100 disabled:opacity-50 dark:focus:ring-brand-400 disabled:pointer-events-none dark:focus:ring-offset-brand-900 data-[state=open]:bg-brand-100 dark:data-[state=open]:bg-brand-800',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 py-2 px-4',
        lg: 'h-11 px-8 rounded-md',
        sm: 'h-9 px-2 rounded-md',
      },
      variant: {
        default: 'bg-brand-900 text-white hover:bg-brand-700 dark:bg-brand-50 dark:text-brand-900',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        ghost:
          'bg-transparent hover:bg-brand-100 dark:hover:bg-brand-800 dark:text-brand-100 dark:hover:text-brand-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'bg-transparent underline-offset-4 hover:underline text-brand-900 dark:text-brand-100 hover:bg-transparent dark:hover:bg-transparent',
        outline:
          'bg-transparent border border-brand-300 hover:bg-brand-200 dark:border-brand-700 dark:text-brand-100',
        subtle:
          'bg-brand-100 text-brand-900 hover:bg-brand-200 dark:bg-brand-700 dark:text-brand-100',
      },
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, loading, size, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _onClick = React.useCallback(
      (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (loading) return;
        props.onClick?.(evt);
      },
      [loading, props],
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
  },
);
Button.displayName = 'Button';
