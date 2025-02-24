import { Medication } from "../interfaces/medication.interface";
import { UpcomingDose } from "../interfaces/upcoming-dose.interface";
import { todayDateString } from "./today-date-string";

export const getUpcomingDoses = (medications: Medication[]): UpcomingDose[] => {
  const upcoming = [];
  const today = new Date();
  const todayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const day = todayDateString();
  medications.filter(med => med.active).forEach(medication => {
    if (medication.schedule === 'daily' ||
      (medication.schedule === 'weekly' && medication.weeklyDay == todayName)) {

      const [hours, minutes] = medication.time.split(':');
      const doseDate = new Date(today);
      doseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      console.log(medication.takenDoses);
      upcoming.push({
        medicationName: medication.name,
        dosage: medication.dosage,
        datetime: doseDate,
        taken: medication.takenDoses && medication.takenDoses.includes(day)
      });

    }
  });

  return upcoming.sort((a, b) => a.datetime - b.datetime);
};