let addCoord = document.querySelector("#add-coord");
let regPop = document.querySelector("#reg-pop");
let overlay = document.querySelector(".overlay");
let closeCoordPop = document.querySelector("#close-coord-btn");

addCoord.addEventListener('click', () => {
  regPop.classList.remove("hidden");
  regPop.classList.add("block");
  overlay.classList.remove("hidden");
});

closeCoordPop.addEventListener('click', () => {
  regPop.classList.add("hidden");
  regPop.classList.remove("block");
  overlay.classList.add("hidden");
});