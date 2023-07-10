import { format } from 'date-fns-tz';

export const formatISO = (date: Date) =>
  date
    ? format(date, "yyyy-MM-dd'T'HH:mm:ssxxx", { timeZone: 'Asia/Shanghai' })
    : undefined;
