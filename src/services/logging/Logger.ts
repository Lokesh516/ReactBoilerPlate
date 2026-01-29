/**
 * Centralized Logger Service
 * Provides structured logging with multiple levels and remote logging support
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface LogEntry {
    timestamp: number;
    level: LogLevel;
    message: string;
    context?: Record<string, unknown>;
    sessionId: string;
    stackTrace?: string;
}

interface LoggerConfig {
    /**
     * Minimum log level to process
     */
    minLevel: LogLevel;

    /**
     * Enable console logging (development)
     */
    enableConsole: boolean;

    /**
     * Enable remote logging (production)
     */
    enableRemote: boolean;

    /**
     * Remote endpoint for log submission
     */
    remoteEndpoint?: string;

    /**
     * Batch size for remote logs
     */
    batchSize: number;

    /**
     * Flush interval in milliseconds
     */
    flushInterval: number;

    /**
     * Maximum entries to keep in memory
     */
    maxBufferSize: number;
}

type TimerType = ReturnType<typeof setInterval>;

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 4,
};

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
    DEBUG: '#7c3aed', // violet
    INFO: '#2563eb', // blue
    WARN: '#f59e0b', // amber
    ERROR: '#ef4444', // red
    CRITICAL: '#991b1b', // red-900
};

/**
 * Centralized Logger Service
 * Handles structured logging with optional remote logging
 */
export class Logger {
    private static instance: Logger;
    private config: LoggerConfig;
    private logBuffer: LogEntry[] = [];
    private sessionId: string;
    private flushTimer: TimerType | null = null;

    private constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {
            minLevel: (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'INFO',
            enableConsole: import.meta.env.MODE === 'development',
            enableRemote: import.meta.env.VITE_ENABLE_REMOTE_LOGGING === 'true',
            remoteEndpoint: import.meta.env.VITE_LOG_ENDPOINT || '/api/logs',
            batchSize: 50,
            flushInterval: 5000,
            maxBufferSize: 200,
            ...config,
        };

        this.sessionId = this.generateSessionId();
        this.initializeFlushTimer();
    }

    /**
     * Get or create logger instance (singleton)
     */
    static getInstance(config?: Partial<LoggerConfig>): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(config);
        }
        return Logger.instance;
    }

    /**
     * Generate a unique session ID
     */
    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Initialize auto-flush timer
     */
    private initializeFlushTimer(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        this.flushTimer = setInterval(async () => {
            if (this.logBuffer.length > 0) {
                await this.flush();
            }
        }, this.config.flushInterval);
    }

    /**
     * Check if log level should be processed
     */
    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.config.minLevel];
    }

    /**
     * Format log message for console
     */
    private formatConsoleMessage(entry: LogEntry): string {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        return `[${time}] [${entry.level}] ${entry.message}`;
    }

    /**
     * Create a log entry
     */
    private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
        return {
            timestamp: Date.now(),
            level,
            message,
            context,
            sessionId: this.sessionId,
            stackTrace: this.getStackTrace(),
        };
    }

    /**
     * Get stack trace (excluding this function)
     */
    private getStackTrace(): string | undefined {
        const stack = new Error().stack;
        return stack ? stack.split('\n').slice(3).join('\n') : undefined;
    }

    /**
     * Log to console
     */
    private logToConsole(entry: LogEntry): void {
        if (!this.config.enableConsole) {
            return;
        }

        const message = this.formatConsoleMessage(entry);
        const color = LOG_LEVEL_COLORS[entry.level];
        const style = `color: ${color}; font-weight: bold;`;

        if (entry.context) {
            console.log(`%c${message}`, style, entry.context);
        } else {
            console.log(`%c${message}`, style);
        }
    }

    /**
     * Add entry to buffer
     */
    private bufferLog(entry: LogEntry): void {
        this.logBuffer.push(entry);

        // Remove oldest entries if buffer exceeds max size
        if (this.logBuffer.length > this.config.maxBufferSize) {
            this.logBuffer = this.logBuffer.slice(-this.config.maxBufferSize);
        }

        // Auto-flush if buffer reaches batch size
        if (this.logBuffer.length >= this.config.batchSize) {
            this.flush().catch(console.error);
        }
    }

    /**
     * Send logs to remote endpoint
     */
    private async sendToRemote(entries: LogEntry[]): Promise<void> {
        if (!this.config.enableRemote || !this.config.remoteEndpoint) {
            return;
        }

        try {
            const response = await fetch(this.config.remoteEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ logs: entries }),
            });

            if (!response.ok) {
                console.error(`[Logger] Remote logging failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('[Logger] Error sending logs to remote endpoint:', error);
        }
    }

    /**
     * Log at DEBUG level
     */
    debug(message: string, context?: Record<string, unknown>): void {
        if (!this.shouldLog('DEBUG')) return;

        const entry = this.createLogEntry('DEBUG', message, context);
        this.logToConsole(entry);
        this.bufferLog(entry);
    }

    /**
     * Log at INFO level
     */
    info(message: string, context?: Record<string, unknown>): void {
        if (!this.shouldLog('INFO')) return;

        const entry = this.createLogEntry('INFO', message, context);
        this.logToConsole(entry);
        this.bufferLog(entry);
    }

    /**
     * Log at WARN level
     */
    warn(message: string, context?: Record<string, unknown>): void {
        if (!this.shouldLog('WARN')) return;

        const entry = this.createLogEntry('WARN', message, context);
        this.logToConsole(entry);
        this.bufferLog(entry);
    }

    /**
     * Log at ERROR level
     */
    error(message: string, context?: Record<string, unknown>): void {
        if (!this.shouldLog('ERROR')) return;

        const entry = this.createLogEntry('ERROR', message, context);
        this.logToConsole(entry);
        this.bufferLog(entry);
    }

    /**
     * Log at CRITICAL level
     */
    critical(message: string, context?: Record<string, unknown>): void {
        if (!this.shouldLog('CRITICAL')) return;

        const entry = this.createLogEntry('CRITICAL', message, context);
        this.logToConsole(entry);
        this.bufferLog(entry);
    }

    /**
     * Flush buffered logs to remote
     */
    async flush(): Promise<void> {
        if (this.logBuffer.length === 0) {
            return;
        }

        const entriesToSend = [...this.logBuffer];
        this.logBuffer = [];

        await this.sendToRemote(entriesToSend);
    }

    /**
     * Clear buffer
     */
    clear(): void {
        this.logBuffer = [];
    }

    /**
     * Get current buffer
     */
    getBuffer(): LogEntry[] {
        return [...this.logBuffer];
    }

    /**
     * Cleanup and dispose
     */
    dispose(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
    }
}

/**
 * Export singleton instance
 */
export const logger = Logger.getInstance();
