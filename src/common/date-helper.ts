import { format } from 'date-fns';

export const formatISO = (date: Date) =>
  date ? format(date, "yyyy-MM-dd'T'HH:mm:ssxxx") : undefined;
