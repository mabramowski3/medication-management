
import { getUpcomingDoses } from "../util/get-upcoming-doses";
import { todayDateString } from "../util/today-date-string";

const UpcomingDoses = ({ medications, toggleDoseStatus }) => {
 
  const upcomingDoses = getUpcomingDoses(medications);
  const day = todayDateString();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Today's Doses</h2>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {upcomingDoses.map((dose) => (
            <div key={dose.medicationName} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={dose.taken}
                  onChange={() => toggleDoseStatus({medicationName:dose.medicationName, day})}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 mr-4 cursor-pointer"
                />
                <div>
                  <span className="font-medium">{dose.medicationName}</span>
                  <span className="text-sm text-gray-500 ml-2">{dose.dosage}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {dose.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {upcomingDoses.length === 0 && (
            <div className="text-center text-gray-500 py-4">No medications scheduled for today</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingDoses;