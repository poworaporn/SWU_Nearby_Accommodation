const mapPreview = document.getElementById("map-preview");
const toolbar = document.getElementById("preview-toolbar");
const detail = document.getElementById("sample-detail");
const toggleDetail = document.getElementById("toggle-detail");
const mood = window.NongMood.mount(mapPreview, {
  topInset: () => toolbar.offsetTop + toolbar.offsetHeight
});

toggleDetail.addEventListener("click", () => {
  detail.hidden = !detail.hidden;
  toggleDetail.setAttribute("aria-pressed", String(!detail.hidden));
  mood.layout();
});

document.getElementById("reset-mascot").addEventListener("click", mood.reset);
new ResizeObserver(mood.layout).observe(toolbar);
