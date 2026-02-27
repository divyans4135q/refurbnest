import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    onClick,
    type = 'primary',
    size = 'md',
    icon,
    style,
    className = '',
    disabled = false
}) => {
    const baseStyle = {
        padding: size === 'sm' ? '0.6rem 1.2rem' : size === 'lg' ? '1.2rem 2.5rem' : '0.8rem 2rem',
        borderRadius: 'var(--radius-full)',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
        fontSize: size === 'sm' ? 'var(--font-sm)' : size === 'lg' ? 'var(--font-lg)' : 'var(--font-md)',
        transition: 'var(--transition)',
        opacity: disabled ? 0.6 : 1,
        ...style
    };

    const themes = {
        primary: {
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            color: 'var(--white)',
            boxShadow: 'var(--shadow-md)',
        },
        secondary: {
            background: 'var(--white)',
            color: 'var(--dark)',
            border: '1px solid #e2e8f0',
        },
        ghost: {
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            color: 'var(--white)',
            border: '1px solid rgba(255,255,255,0.2)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
        }
    };

    const currentTheme = themes[type] || themes.primary;

    return (
        <motion.button
            whileHover={!disabled ? { y: -3, boxShadow: type === 'primary' ? 'var(--shadow-primary)' : 'var(--shadow-md)' } : {}}
            whileTap={!disabled ? { scale: 0.96 } : {}}
            onClick={disabled ? null : onClick}
            style={{ ...baseStyle, ...currentTheme }}
            className={`custom-btn ${className}`}
            disabled={disabled}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default Button;
