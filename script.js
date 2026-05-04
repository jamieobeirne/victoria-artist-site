const shell = document.querySelector(".site-shell");
const button = document.getElementById("enter-btn");
const contentLayer = document.getElementById("content-layer");

button?.addEventListener("click", () => {
  shell?.setAttribute("data-state", "content");
  contentLayer?.setAttribute("aria-hidden", "false");
});
