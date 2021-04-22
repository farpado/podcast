export function convertDurationToTimeString(duration: number){
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60; 

    const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0')) // transforma em string (2 = vai ser mostrado em 2 numeros se nao tiver vai mostrar o (0 no começo))
    .join(':')

    return timeString;
}