/**
 * Logger utility for environment-aware logging
 * Only logs debug/info in development, always logs warnings/errors
 */

const isDev = import.meta.env.DEV;

export const logger = {
    /**
     * Debug logs - only in development
     */
    debug: (...args: unknown[]): void => {
        if (isDev) {
            console.log(...args);
        }
    },

    /**
     * Info logs - only in development
     */
    info: (...args: unknown[]): void => {
        if (isDev) {
            console.info(...args);
        }
    },

    /**
     * Warning logs - always shown
     */
    warn: (...args: unknown[]): void => {
        console.warn(...args);
    },

    /**
     * Error logs - always shown
     */
    error: (...args: unknown[]): void => {
        console.error(...args);
    },
};
