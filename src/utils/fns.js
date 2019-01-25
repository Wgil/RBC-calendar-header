import { addDays, eachDay, startOfWeek, startOfMonth } from 'date-fns'
import { VISIBLE_DAYS } from './constants'

/**
 * Get a dates interval array between the start of week of the first month of `start`.
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
