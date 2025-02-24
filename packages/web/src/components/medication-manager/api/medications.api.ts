import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Medication } from "../interfaces/medication.interface";



export const useGetMedications = () => useQuery({
  queryKey: ['medications'],
  initialData: [],
  queryFn: async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/medications`,
      {
        headers: { "x-api-key": import.meta.env.VITE_API_KEY }
      }
    )
    return await response.json()
  },
});

export const useAddMedication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMedication: Medication) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/medications`,
        {
          method: 'POST',
          body: JSON.stringify(newMedication),
          headers: { "x-api-key": import.meta.env.VITE_API_KEY }
        }
      )
      return newMedication; //dynamodb doesn't seem to allow returning the new object with a put command
    },
    onSuccess: (medication) => {
      let medications: Medication[] = queryClient.getQueryData(['medications']);
      medications = medications.filter(m => m.name !== medication.name);
      medications.push(medication);
      queryClient.setQueryData(['medications'], medications);
    }
  });
}

export const useUpdateTakenDose = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dose: { medicationName: string, day: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/medications/update-taken-dose`,
        {
          method: 'PATCH',
          body: JSON.stringify({ medicationName: dose.medicationName, day: dose.day }),
          headers: { "x-api-key": import.meta.env.VITE_API_KEY }
        }
      )
      const takenDoses = await response.json();
      return { name: dose.medicationName, takenDoses }
    },
    onSuccess: (result: { name: string, takenDoses: string[] }) => {
      const medications: Medication[] = queryClient.getQueryData(["medications"]);
      medications.find(m => m.name === result.name).takenDoses = result.takenDoses;
      queryClient.setQueryData(['medications'], [...medications]);
    }
  });
}

export const useUpdateActiveStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (medicationAndStatus: { medicationName: string, active: boolean }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/medications/update-active-status`,
        {
          method: 'PATCH',
          body: JSON.stringify(medicationAndStatus),
          headers: { "x-api-key": import.meta.env.VITE_API_KEY }
        }
      )
      const result = await response.json();
      console.log("result", result);
      return { name: medicationAndStatus.medicationName, active: result }
    },
    onSuccess: (result: { name: string, active: boolean }) => {
      const medications: Medication[] = queryClient.getQueryData(["medications"]);
      medications.find(m => m.name === result.name).active = result.active;
      queryClient.setQueryData(['medications'], [...medications]);
    }
  });
}