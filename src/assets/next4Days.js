export function getNextFourDays() {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date().getDay(); 
  
    const nextFourDays = [];
    for (let i = 1; i <= 4; i++) {
      const nextDayIndex = (today + i) % 7; 
      nextFourDays.push(daysOfWeek[nextDayIndex]);
    }
  
    return nextFourDays;
  }
  