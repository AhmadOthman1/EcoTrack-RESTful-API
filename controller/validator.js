 function isEmail(s) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(s);
}
 function isPhoneNumber(s) {
    const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return regex.test(s);
}
 function isDate(s) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(s);
}
 function isUsername(s) {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9_.]+[a-zA-Z0-9]$/;
    return regex.test(s);
}
module.exports = {
    isEmail,
    isPhoneNumber,
    isDate,
    isUsername,
  };