let closeEventPop = document.querySelector("#close-event-btns");
let addEvent = document.querySelector("#add-event");
let eventPop = document.querySelector("#event-pop");

addEvent.addEventListener('click', () => {
  eventPop.classList.remove("hidden");
  eventPop.classList.add("block");
});

closeEventPop.addEventListener('click', () => {
  eventPop.classList.add("hidden");
  eventPop.classList.remove("block");
});



