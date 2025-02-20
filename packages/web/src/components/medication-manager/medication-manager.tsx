import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

const MedicationManager = () => {
  const [medications, setMedications] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [takenDoses, setTakenDoses] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    schedule: 'daily',
    times: ['08:00'],
    days: ['monday'],
    isActive: true
  });

  const getUpcomingDoses = () => {
    const upcoming = [];
    const today = new Date();
    const todayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    medications.filter(med => med.isActive).forEach(medication => {
      if (medication.schedule === 'daily' ||
          (medication.schedule === 'weekly' && medication.days.includes(todayName))) {
        medication.times.forEach(time => {
          const [hours, minutes] = time.split(':');
          const doseDate = new Date(today);
          doseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const doseId = `${medication.name}-${doseDate.toISOString()}`;
          upcoming.push({
            id: doseId,
            medication: medication.name,
            dosage: medication.dosage,
            datetime: doseDate,
            taken: takenDoses.includes(doseId)
          });
        });
      }
    });

    return upcoming.sort((a, b) => a.datetime - b.datetime);
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && 
        ((newMedication.schedule === 'daily' && newMedication.times.length > 0) ||
         (newMedication.schedule === 'weekly' && newMedication.days.length > 0 && newMedication.times.length > 0))) {
      setMedications([...medications, newMedication]);
      setNewMedication({
        name: '',
        dosage: '',
        schedule: 'daily',
        times: ['08:00'],
        days: ['monday'],
        isActive: true
      });
      setShowAddDialog(false);
    }
  };

  const toggleMedicationStatus = (index) => {
    const updatedMedications = [...medications];
    updatedMedications[index].isActive = !updatedMedications[index].isActive;
    setMedications(updatedMedications);
  };

  const toggleDoseTaken = (dose) => {
    if (takenDoses.includes(dose.id)) {
      setTakenDoses(takenDoses.filter(id => id !== dose.id));
    } else {
      setTakenDoses([...takenDoses, dose.id]);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medication Manager</h1>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </button>
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Medication</h2>
              <button
                onClick={() => setShowAddDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
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
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button
                      key={day}
                      className={`px-3 py-1 rounded ${
                        newMedication.days.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        const days = newMedication.days.includes(day)
                          ? newMedication.days.filter(d => d !== day)
                          : [...newMedication.days, day];
                        setNewMedication({...newMedication, days});
                      }}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={newMedication.times[0]}
                onChange={(e) => setNewMedication({...newMedication, times: [e.target.value]})}
              />
              <button
                onClick={handleAddMedication}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">Today's Doses</h2>
            <p className="text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {getUpcomingDoses().map((dose) => (
                <div key={dose.id} className="flex items-center p-2 border rounded group">
                  <input
                    type="checkbox"
                    checked={dose.taken}
                    onChange={() => toggleDoseTaken(dose)}
                    className="w-5 h-5 mr-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex-grow">
                    <span className={`font-medium ${dose.taken ? 'line-through text-gray-500' : ''}`}>
                      {dose.medication}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">{dose.dosage}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {dose.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {getUpcomingDoses().length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No medications scheduled for today
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">All Medications</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {medications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{medication.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{medication.dosage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      {medication.schedule === 'daily' ? 'Daily' : 'Weekly'} at{' '}
                      {medication.times.join(', ')}
                    </span>
                    <button
                      onClick={() => toggleMedicationStatus(index)}
                      className={`px-4 py-2 rounded ${
                        medication.isActive
                          ? 'border border-gray-300 hover:bg-gray-100'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {medication.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              ))}
              {medications.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No medications added yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationManager;