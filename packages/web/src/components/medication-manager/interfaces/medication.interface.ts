export interface Medication {
  name: string;
  dosage: string;
  schedule: string;
  time: string;
  weeklyDay: string;
  active: boolean;
  takenDoses: string[];
}