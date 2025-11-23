import React from 'react';
import { MonitorCog, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
  {
    icon: MonitorCog,
    value: 'system',
    label: 'System',
  },
  {
    icon: Sun,
    value: 'light',
    label: 'Light',
  },
  {
    icon: Moon,
    value: 'dark',
    label: 'Dark',
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-muted/80 inline-flex items-center overflow-hidden rounded-full border p-1"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={cn(
            'relative flex size-7 cursor-pointer items-center justify-center rounded-full transition-all',
            theme === option.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
          role="radio"
          aria-checked={theme === option.value}
          aria-label={`Switch to ${option.value} theme`}
          onClick={() => setTheme(option.value)}
          title={option.label}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-option"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              className="bg-background absolute inset-0 rounded-full shadow-sm"
            />
          )}
          <option.icon className="z-10 size-4" />
        </button>
      ))}
    </motion.div>
  );
}