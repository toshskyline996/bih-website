import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * BIH Button 组件
 * 
 * 设计意图：工业极简风格，直线硬边，无多余阴影
 * - primary: 工程黄底 + 深海蓝字（主 CTA）
 * - secondary: 深海蓝底 + 白字（次要操作）
 * - outline: 蓝色描边（轻量操作）
 * - ghost: 无背景（导航链接）
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bih-navy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-bih-yellow text-bih-navy hover:bg-bih-yellow-dark active:bg-bih-yellow-dark',
        secondary:
          'bg-bih-navy text-white hover:bg-bih-navy-light active:bg-bih-navy-dark',
        outline:
          'border-2 border-bih-navy text-bih-navy bg-transparent hover:bg-bih-navy hover:text-white',
        ghost:
          'text-bih-navy hover:bg-bih-gray-100',
        danger:
          'bg-bih-orange text-white hover:bg-bih-orange-dark',
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
