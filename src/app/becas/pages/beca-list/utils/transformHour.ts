export function transformSchedule(scheduleList) {
    const weekDays = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const defaultHours = [{
        start: "06:00 AM",
        end: "07:00 AM"
    }];

    const scheduleMap = scheduleList.reduce((acc, entry) => {
        acc[entry.day] = entry.coveredHours.map(period => {
            const [start, end] = period.split("-");
            return {
                start: convertTimeFormat(start),
                end: convertTimeFormat(end),
                valid: true
            };
        });
        return acc;
    }, {});

    return weekDays.map(day => ({
        day: day,
        hours: scheduleMap[day] || defaultHours
    }));
}

function convertTimeFormat(timeStr) {
    let [hour, minute] = timeStr.split(":").map(Number);
    const period = hour < 12 ? "AM" : "PM";
    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour -= 12;
    }
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}