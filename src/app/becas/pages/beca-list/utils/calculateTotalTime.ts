// Función para calcular la diferencia en horas entre dos tiempos en formato "hh:mm AM/PM"

export const parseTime = time => {
    let [hours, minutes] = time.split(/[: ]/);
    const period = time.split(' ')[1];
    if (period === 'PM' && hours !== '12') {
        hours = parseInt(hours) + 12;
    }
    if (period === 'AM' && hours === '12') {
        hours = 0;
    }
    return parseInt(hours) * 60 + parseInt(minutes);
};

export function calculateHours(start, end) {
    const startTime = parseTime(start);
    const endTime = parseTime(end);

    return (endTime - startTime) / 60;
}

// Función para determinar el total de horas
export function totalHours(schedule) {
    let total = 0;

    schedule.forEach(day => {
        day.hours.forEach(hour => {
            total += calculateHours(hour.start, hour.end);
        });
    });

    return total;
}
