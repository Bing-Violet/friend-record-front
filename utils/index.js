function dateConvert(date) {
    const dateObj = new Date();
    const offset = dateObj.getTimezoneOffset();
    let dt = new Date(date);
    const localTime = dt.setMinutes(offset * -1 + dt.getMinutes());

    dt = new Date(localTime);
    const stringDT = dt.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return stringDT.replace(/\//g, "-");
}

export {dateConvert}
