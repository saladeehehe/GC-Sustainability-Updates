// src/utils/dateUtils.js

import { parse } from 'date-fns';

const dateFormat = 'dd MMM yyyy'; // Format for '21 Jul 2023'

/**
 * Converts a date string to a Date object.
 * @param dateString - The date string to convert.
 * @returns The corresponding Date object.
 */
export const convertToDate = (dateString: string): Date => {
  return parse(dateString, dateFormat, new Date());
};