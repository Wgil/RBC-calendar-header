import { addDays, eachDay, startOfWeek } from 'date-fns'
import { VISIBLE_DAYS } from './constants'

/**
 * Get a dates interval array between the start of week of first parameter until
 * the last parameter.
 *
 * @param {Date} start
 * @param {Date} end
 *
 * @return {Array}
 */
export const visibleDaysInterval = (start, end = VISIBLE_DAYS) => {
  const startDate = startOfWeek(start)
  return eachDay(startDate, addDays(startDate, end - 1))
}
