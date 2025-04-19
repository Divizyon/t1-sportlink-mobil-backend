/**
 * @swagger
 * components:
 *   schemas:
 *     LogLevel:
 *       type: string
 *       enum:
 *         - debug
 *         - info
 *         - warn
 *         - error
 *       description: "Loglama seviyesi"
 */

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Uygulama genelinde kullanılacak basit bir logger
 */
class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Debug mesajı loglar
   */
  debug(message: string, meta?: object): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Bilgi mesajı loglar
   */
  info(message: string, meta?: object): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Uyarı mesajı loglar
   */
  warn(message: string, meta?: object): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Hata mesajı loglar
   */
  error(message: string, error?: Error, meta?: object): void {
    const errorMeta = error ? {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      ...meta
    } : meta;

    this.log(LogLevel.ERROR, message, errorMeta);
  }

  private log(level: LogLevel, message: string, meta?: object): void {
    const timestamp = new Date().toISOString();
    const logObject = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(meta && { meta })
    };

    // Üretim ortamında yapılandırılmış bir loglama aracı kullanabilirsiniz
    // (örn: Winston, Pino vb.)
    if (level === LogLevel.ERROR) {
      console.error(JSON.stringify(logObject));
    } else if (level === LogLevel.WARN) {
      console.warn(JSON.stringify(logObject));
    } else if (level === LogLevel.INFO) {
      console.info(JSON.stringify(logObject));
    } else {
      console.log(JSON.stringify(logObject));
    }
  }
}

export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

export default Logger; 