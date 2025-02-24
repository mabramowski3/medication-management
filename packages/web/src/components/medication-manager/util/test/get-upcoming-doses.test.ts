import { getUpcomingDoses } from "../get-upcoming-doses";
import { expect, test } from 'vitest';

test('upcoming doses should exclude inactive medications', () => {
  const expected =  [];
  const medications = [{name: 'Advil', dosage: '1 pill', schedule: 'daily', time: '08:00', weeklyDay: 'Monday', active: false, takenDoses: ['2025-02-02']}];
  expect(getUpcomingDoses(medications)).toEqual(expected);
})