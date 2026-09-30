import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'lavender' | 'green' | 'yellow' | 'peach' | 'blue' | 'pink';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  ...props
}) => {
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    lavender: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
    green: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    yellow: 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]',
    peach: 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]',
    blue: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
    pink: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
