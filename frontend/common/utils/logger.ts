import log from "loglevel";
// INFO: log.debug will not be shown in production, while log.info will be shown in both development and production
log.setLevel(import.meta.env.DEV ? log.levels.DEBUG : log.levels.INFO);
export default log;
