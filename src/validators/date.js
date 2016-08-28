// Official docs https://www.w3.org/TR/html5/infrastructure.html#valid-date-string

//console.log("BUAAA")
//console.log(Date, typeof Date)
//console.log(window, typeof window)
export default function dateValidator(control) {
  const date = Date.parse(control.value);
  return Number.isNaN(date);
}