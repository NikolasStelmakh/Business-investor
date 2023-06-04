import bunyan, { LogLevelString } from 'bunyan';

const logger = bunyan.createLogger({
   name: 'bi-api',
   streams: [
      {
         name: 'stdout',
         level: (process.env.LOG_LEVEL as LogLevelString) || 'trace',
         stream: process.stdout,
      },
      { name: 'stderr', level: 'error', stream: process.stderr },
   ],
   serializers: {
      error: bunyan.stdSerializers.err,
   },
});

export default logger;
