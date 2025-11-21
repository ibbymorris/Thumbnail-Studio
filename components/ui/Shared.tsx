
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, onClick, variant = 'primary', className = '', disabled = false 
}) => {
    const base = "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const styles = {
        primary: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20",
        secondary: "bg-[#1c1e20] border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
            {children}
        </button>
    );
};

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
    <div onClick={onClick} className={`bg-[#1c1e20] border border-white/10 rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'accent';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${variant === 'accent' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/50 text-gray-400'}`}>
        {children}
    </span>
);
