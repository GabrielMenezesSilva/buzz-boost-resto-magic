/**
 * Central Logger Utility
 * 
 * Substitui chamadas diretas ao console e permite fácil switch
 * para plataformas de Observability como Sentry, Datadog ou LogRocket
 * no momento do deploy de Produção.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: string, context?: any) {
    // Em dev, sempre mostra
    if (import.meta.env.DEV) {
        if (context) {
            console[level](`[${level.toUpperCase()}] ${message}`, context);
        } else {
            console[level](`[${level.toUpperCase()}] ${message}`);
        }
    }

    // Em produção, isso pode rotear para Sentry
    if (import.meta.env.PROD && level === 'error') {
        // Sentry.captureException(context?.error || new Error(message), { extra: context });
    }
}

export const logger = {
    info: (message: string, context?: any) => log('info', message, context),
    warn: (message: string, context?: any) => log('warn', message, context),
    error: (message: string, error?: Error | any, context?: any) => log('error', message, { error, ...context }),
    debug: (message: string, context?: any) => log('debug', message, context),
};
