import { format, zonedTimeToUtc } from 'date-fns-tz';

const timeZone = 'Asia/Shanghai';

export const formatISO = (date: Date) =>
  date ? format(date, "yyyy-MM-dd'T'HH:mm:ssxxx", { timeZone }) : undefined;

export const utc = (date: string) =>
  date ? zonedTimeToUtc(date, timeZone) : undefined;
