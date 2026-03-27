import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * BIH Badge 组件
 * 
 * 用于 CE/ISO 认证标识、材质标签、状态指示
 * 工业风格：无圆角，硬边矩形
 */
const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-bih-navy text-white',
        yellow: 'border-transparent bg-bih-yellow text-bih-navy',
        orange: 'border-transparent bg-bih-orange text-white',
        outline: 'border-bih-navy text-bih-navy',
        muted: 'border-bih-gray-200 bg-bih-gray-100 text-bih-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
