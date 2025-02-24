import { useState } from "react";
import WeekdaySelector from "./weekday-selector";
import { X } from "lucide-react";
import { Medication } from "../interfaces/medication.interface";


const AddMedicationDialog = ({ onAdd, onClose }) => {
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    schedule: 'daily',
    time: '08:00',
    weeklyDay: 'monday', 
    active: true,
    takenDoses: [],
  });

  const isValidMedication = (medication: Medication) => {
    return medication.name && medication.dosage && 
      ((medication.schedule === 'daily' && medication.time.length > 0) ||
       (medication.schedule === 'weekly' && medication.weeklyDay && medication.time));
  };

  const handleSubmit = () => {
    if (isValidMedication(newMedication)) {
      onAdd(newMedication);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Medication</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Medication Name"
            className="w-full p-2 border rounded"
            value={newMedication.name}
            onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Dosage"
            className="w-full p-2 border rounded"
            value={newMedication.dosage}
            onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
          />
          <select
            className="w-full p-2 border rounded"
            value={newMedication.schedule}
            onChange={(e) => setNewMedication({...newMedication, schedule: e.target.value})}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          {newMedication.schedule === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Day
              </label>
              <WeekdaySelector
                selectedDay={newMedication.weeklyDay}
                onChange={(day) => setNewMedication({...newMedication, weeklyDay: day})}
              />
            </div>
          )}
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={newMedication.time}
            onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Medication
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationDialog;