export interface Medication {
  name: string;
  dosage: string;
  schedule: string;
  time: string;
  weeklyDay: string;
  //true if the medication is active
  active: boolean;
  //A list of dates in yyyy-MM-dd format
  takenDoses: string[];
}