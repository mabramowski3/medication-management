import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import UpcomingMedications from './components/upcoming-doses.js';
import MedicationList from './components/medication-list.js';
import AddMedicationDialog from './components/add-medication-dialog.js';
import { Medication } from './interfaces/medication.interface.js';
import LoadingOverlay from '../loading-overlay/loading-overlay.js';
import { useAddMedication, useGetMedications, useUpdateActiveStatus, useUpdateTakenDose } from './api/medications.api.js';

const MedicationManager = () => {

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  const { data, isFetching } = useGetMedications();

  const addMedicationMutation = useAddMedication();
  const updateTakenDose = useUpdateTakenDose();

  const updateActiveStatus = useUpdateActiveStatus();
  const handleAddMedication = (newMedication: Medication) => {
    addMedicationMutation.mutate(newMedication)
    setShowAddDialog(false);
  };

  const updateMedicationStatus = (medicationName: string, active: boolean) => {
    updateActiveStatus.mutate({ medicationName, active });
  };

  const toggleDoseStatus = (dose) => {
    updateTakenDose.mutate(dose)
  };

  return (
    <LoadingOverlay isLoading={isFetching || updateActiveStatus.isPending || updateTakenDose.isPending || addMedicationMutation.isPending}>
      <div className="p-4 max-w-4xl mx-auto h-screen">
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
          <AddMedicationDialog
            onAdd={handleAddMedication}
            onClose={() => setShowAddDialog(false)}
          />
        )}

        <div className="space-y-6">
          <UpcomingMedications medications={data} toggleDoseStatus={toggleDoseStatus} />
          <MedicationList medications={data} updateMedicationStatus={updateMedicationStatus} />
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default MedicationManager;