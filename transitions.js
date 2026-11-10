const exitDelay = 700;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const overlay = document.createElement("div");
overlay.className = "page-transition";
overlay.innerHTML = "<span></span><span></span>";
document.documentElement.append(overlay);

const markReady = () => {
  void overlay.offsetHeight;
  document.documentElement.classList.add("is-ready");
};

if (document.readyState === "complete") {
  markReady();
} else {
  window.addEventListener("load", markReady);
}

setTimeout(markReady, 4000);

document.addEventListener("click", (event) => {
  if (reduceMotion.matches) return;

  const link = event.target.closest("a");
  if (!link || !link.href) return;

  const url = new URL(link.href, location.href);
  const isSameSite = url.protocol === location.protocol && url.host === location.host;
  const isSamePage = url.pathname === location.pathname;
  const opensElsewhere =
    link.target === "_blank" ||
    link.hasAttribute("download") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey;

  if (!isSameSite || isSamePage || opensElsewhere) return;

  event.preventDefault();
  document.documentElement.classList.add("is-leaving");
  setTimeout(() => {
    location.href = url.href;
  }, exitDelay);
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.documentElement.classList.remove("is-leaving");
  }
});