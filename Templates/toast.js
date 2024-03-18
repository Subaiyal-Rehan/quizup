function toastGreen(message) {
  return  Toastify({ text: message, duration: 2000, close: true, gravity: "top", position: "center", stopOnFocus: true, style: { background: "rgb(25, 135, 84)", }, onClick: function () { } }).showToast();
}

function toastRed(message) {
  return  Toastify({ text: message, duration: 2000, close: true, gravity: "top", position: "center", stopOnFocus: true, style: { background: "rgb(220, 53, 69)", }, onClick: function () { } }).showToast();
}

export { toastGreen, toastRed }