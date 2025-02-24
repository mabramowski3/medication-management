const MedicationList = ({ medications, updateMedicationStatus }) => (
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
                {medication.schedule === 'daily' ? 'Daily' : medication.weeklyDay.charAt(0).toUpperCase() + medication.weeklyDay.slice(1)} at {medication.time}
              </span>
              <button
                onClick={() => updateMedicationStatus(medication.name, !medication.active)}
                className={`px-4 py-2 rounded ${
                  medication.active
                    ? 'border border-gray-300 hover:bg-gray-100'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {medication.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        ))}
        {medications.length === 0 && (
          <div className="text-center text-gray-500 py-4">No medications added yet</div>
        )}
      </div>
    </div>
  </div>
);

export default MedicationList;