function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 10),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  if (hours > 0) {
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + "h" + minutes + "m " + seconds + "." + milliseconds + "s";
  }

  if (minutes > 0) {
    return minutes + "m " + seconds + "." + milliseconds + "s";
  }

  return parseInt(seconds) + "." + milliseconds + "s";
}

export default msToTime;
