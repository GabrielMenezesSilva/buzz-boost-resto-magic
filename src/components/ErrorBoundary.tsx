import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { logger } from '@/lib/logger';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('Uncaught React Rendering Error:', error, { errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full text-center space-y-4">
                        <h1 className="text-3xl font-bold text-destructive">Ops! Algo deu errado.</h1>
                        <p className="text-muted-foreground break-words text-sm">
                            {this.state.error?.message || "Ocorreu um erro inesperado."}
                        </p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Recarregar Página
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
