import {
  addDays,
  eachDay,
  startOfWeek,
  startOfMonth,
  addMonths,
  addYears
} from 'date-fns'
import { VISIBLE_DAYS } from './constants'

/**
 * Get a dates interval between the start of week of the first month of `start` date.
 * The length of the interval is default to `VISIBLE_DAYS` or `length` parameter.
 *
 * @param {Date} start
 * @param {Number} length
 *
 * @return {Array}
 */
export const visibleDaysInterval = (start, length = VISIBLE_DAYS) => {
  const firstDay = startOfWeek(startOfMonth(start), 0)
  const lastDay = addDays(firstDay, length - 1)
  return eachDay(firstDay, lastDay)
}

/**
 * Given a date, get a list of `length` next months.
 *
 * @param {Object} start - start date
 * @param {Number} length - months quantity
 */
export const eachMonth = (start, length) =>
  Array.from({ length }, (_, months) => addMonths(start, months))

export const eachYear = (start, length) =>
  Array.from({ length }, (_, years) => addYears(start, years))
