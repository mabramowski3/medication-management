const WeekdaySelector = ({ selectedDay, onChange }) => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return (
      <div className="flex flex-wrap gap-2">
        {weekdays.map(day => (
          <button
            key={day}
            className={`px-3 py-1 rounded ${
              selectedDay === day
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => onChange(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>
    );
  };
  export default WeekdaySelector;