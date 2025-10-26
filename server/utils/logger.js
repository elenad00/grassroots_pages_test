import {createLogger, format, transports, addColors} from "winston";

export default function constructLog(service){
  const customFormat = format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(({ level, message, timestamp, service }) => {
      return `${timestamp} [${level}] [${service}]: ${message}`
    })
  )
  const logLevels = {
    baseLevel: "debug",
    levels:{ info: 0, warn: 1, error: 2 },
    colors:{ info: 'green', warn: 'yellow', error: 'red'}
  }
  addColors(logLevels.colors);
  const log = createLogger({
    level: 'info',
    format: customFormat,
    exitOnError: false,
    defaultMeta: { service: service },
    transports: [new transports.Console()]
  })
  return log
}