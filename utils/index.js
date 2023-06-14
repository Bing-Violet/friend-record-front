

function dateConvert(date) {
    const dt = new Date(date);
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
