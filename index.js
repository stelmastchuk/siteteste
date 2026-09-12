"use strict";

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const menuOpenIcon = document.querySelector(".menu-open-icon");
const menuCloseIcon = document.querySelector(".menu-close-icon");

function setMenu(open, returnFocus = false) {
  mobileNav.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menuOpenIcon.hidden = open;
  menuCloseIcon.hidden = !open;
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener("click", () => setMenu(mobileNav.hidden));
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("click", (event) => {
  if (!mobileNav.hidden && !event.target.closest(".site-header"))
    setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) setMenu(false, true);
});
window.matchMedia("(min-width: 1001px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

const videoDialog = document.querySelector(".video-dialog");
const video = document.querySelector("#presentation-video");
// Informe o ID do vídeo publicado no YouTube para habilitar a apresentação.
const presentationVideoId = "R0F_87QTvYY";
const hasPresentationVideo = /^[A-Za-z0-9_-]{11}$/.test(presentationVideoId);
let videoTrigger;

document.querySelectorAll("[data-open-video]").forEach((link) => {
  if (!hasPresentationVideo) return;
  link.href = `https://www.youtube.com/watch?v=${presentationVideoId}`;
  link.hidden = false;
  link.addEventListener("click", (event) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      typeof videoDialog.showModal !== "function"
    )
      return;
    event.preventDefault();
    videoTrigger = link;
    video.src = `https://www.youtube-nocookie.com/embed/${presentationVideoId}?autoplay=1&playsinline=1`;
    videoDialog.showModal();
    document.body.classList.add("modal-open");
  });
});
document
  .querySelector(".video-close")
  .addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("click", (event) => {
  if (event.target !== videoDialog) return;
  const bounds = videoDialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    videoDialog.close();
});
videoDialog.addEventListener("close", () => {
  video.removeAttribute("src");
  document.body.classList.remove("modal-open");
  videoTrigger?.focus();
});

// Preserve direct links to the sections used by the previous site.
const legacyAnchors = {
  "#block-1": "#homeopatia",
  "#block-2": "#duvidas",
  "#block-3": "#atendimento",
  "#block-4": "#contato",
  "#block-5": "#sobre-mim",
  "#block-6": "#inicio",
};
if (legacyAnchors[window.location.hash]) {
  const target = legacyAnchors[window.location.hash];
  history.replaceState(null, "", target);
  requestAnimationFrame(() => document.querySelector(target)?.scrollIntoView());
}
