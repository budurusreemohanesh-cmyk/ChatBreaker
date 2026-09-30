import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'warm' | 'lavender' | 'green' | 'yellow' | 'peach' | 'blue' | 'pink';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'white',
  hoverEffect = false,
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border-neutral-200/80 shadow-soft',
    warm: 'bg-[#FAF8F3] border-neutral-200/80 shadow-soft',
    lavender: 'bg-[#FAF5FF] border-[#E9D5FF] text-[#171717] shadow-soft',
    green: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#171717] shadow-soft',
    yellow: 'bg-[#FEFCE8] border-[#FEF08A] text-[#171717] shadow-soft',
    peach: 'bg-[#FFF7ED] border-[#FED7AA] text-[#171717] shadow-soft',
    blue: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#171717] shadow-soft',
    pink: 'bg-[#FDF2F8] border-[#FBCFE8] text-[#171717] shadow-soft',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl border p-6 transition-all duration-200',
          variantStyles[variant],
          hoverEffect && 'hover:-translate-y-0.5 hover:shadow-float',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
