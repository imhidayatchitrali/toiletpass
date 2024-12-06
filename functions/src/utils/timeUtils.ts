export const generateTimeSlot = () => {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setMinutes(startTime.getMinutes() + 15); // Commence dans 15 minutes
  
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1); // Créneau d'une heure
  
  return {
    startTime,
    endTime
  };
};

export const formatTimeSlot = (timeSlot: { start: Date; end: Date }) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  return {
    start: timeSlot.start.toLocaleTimeString('fr-FR', options),
    end: timeSlot.end.toLocaleTimeString('fr-FR', options)
  };
};