/**
 * Time-related action types
 */

export const TIME_ACTIONS = {
  ADVANCE_TIME: 'time/advance' as const,
  SET_TIME: 'time/set' as const,
  SKIP_TO_PERIOD: 'time/skipTo' as const,
  CHANGE_SEASON: 'time/changeSeason' as const,
  SET_WEATHER: 'time/setWeather' as const
};
