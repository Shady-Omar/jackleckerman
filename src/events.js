let closeEventPop = document.querySelector("#close-event-pop");
let addEvent = document.querySelector("#add-event");
let eventPop = document.querySelector("#event-pop");
let overlay = document.querySelector(".overlay");

addEvent.addEventListener('click', () => {
  eventPop.classList.remove("hidden");
  eventPop.classList.add("block");
  overlay.classList.remove("hidden");
});

closeEventPop.addEventListener('click', () => {
  eventPop.classList.add("hidden");
  eventPop.classList.remove("block");
  overlay.classList.add("hidden");
});



