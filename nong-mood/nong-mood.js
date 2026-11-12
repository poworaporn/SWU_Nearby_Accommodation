(() => {
  "use strict";

  const instances = new WeakMap();
  const defaultImage = new URL("nong-mood.png", document.currentScript.src).href;
  const clamp = (value, min, max) => Math.min(Math.max(min, max), Math.max(min, value));

  function mount(host, options = {}) {
    if (!(host instanceof HTMLElement)) throw new TypeError("NongMood.mount expects a map wrapper element.");
    if (instances.has(host)) return instances.get(host);

    const addedPosition = getComputedStyle(host).position === "static";
    if (addedPosition) host.classList.add("nong-mood-host");

    const widget = document.createElement("div");
    widget.className = "nong-mood";
    widget.innerHTML = `
      <div class="nong-mood__note">
        <span></span>
        <button type="button" class="nong-mood__close" aria-label="ปิดคำทักทาย">×</button>
      </div>
      <button type="button" class="nong-mood__toy" aria-label="น้องหมุด ลากหรือใช้ปุ่มลูกศรเพื่อย้ายตำแหน่ง กดเพื่อเปิดหรือปิดคำทักทาย" aria-expanded="true">
        <img alt="" draggable="false">
      </button>`;
    const note = widget.querySelector(".nong-mood__note");
    const close = widget.querySelector(".nong-mood__close");
    const toy = widget.querySelector(".nong-mood__toy");
    note.querySelector("span").textContent = options.message ?? "ให้หมุดช่วยหาที่พักนะ";
    widget.querySelector("img").src = options.image ?? defaultImage;
    host.append(widget);

    const margin = 8;
    let preferred = null;
    let drag = null;
    let suppressClick = false;
    let greetingOpen = true;

    function layout() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const size = widget.offsetWidth;
      if (!width || !height || !size) return;

      const minY = clamp(Number(options.topInset?.() ?? 0) + margin, margin, height - size - margin);
      const maxX = Math.max(margin, width - size - margin);
      const maxY = Math.max(minY, height - size - 32);
      const target = preferred ?? { x: width - size - Math.max(16, width * .04), y: minY + 56 };
      const x = clamp(target.x, margin, maxX);
      const y = clamp(target.y, minY, maxY);
      widget.style.left = x + "px";
      widget.style.top = y + "px";
      widget.style.setProperty("--mood-note-width", Math.min(198, width - margin * 2) + "px");

      const visible = greetingOpen && width >= 150 && height >= 155;
      note.hidden = !visible;
      toy.setAttribute("aria-expanded", String(visible));
      if (!visible) return;
      if (x + size * .76 - note.offsetWidth >= margin) widget.dataset.noteSide = "left";
      else if (x + size * .24 + note.offsetWidth <= width - margin) widget.dataset.noteSide = "right";
      else widget.dataset.noteSide = "center";
      const above = y - note.offsetHeight - 8 >= minY;
      const below = y + size + note.offsetHeight + 8 <= height - 24;
      if (!above && !below) {
        note.hidden = true;
        toy.setAttribute("aria-expanded", "false");
        return;
      }
      widget.dataset.noteVertical = above ? "above" : "below";
      if (widget.dataset.noteSide === "center") {
        const center = clamp(x + size / 2, margin + note.offsetWidth / 2, width - margin - note.offsetWidth / 2);
        note.style.left = (center - x) + "px";
      } else {
        note.style.left = "";
      }
    }

    function showGreeting(open) {
      greetingOpen = open;
      layout();
    }

    // Capture only the two controls. Everything around them remains usable by the map.
    widget.addEventListener("pointerdown", event => event.stopPropagation());
    widget.addEventListener("click", event => event.stopPropagation());
    widget.addEventListener("dblclick", event => event.stopPropagation());
    widget.addEventListener("keydown", event => event.stopPropagation());
    toy.addEventListener("pointerdown", event => {
      if (!event.isPrimary || event.button !== 0) return;
      suppressClick = false;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: widget.offsetLeft, top: widget.offsetTop };
      toy.setPointerCapture(event.pointerId);
    });
    toy.addEventListener("pointermove", event => {
      if (drag?.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!suppressClick && Math.hypot(dx, dy) < 5) return;
      suppressClick = true;
      preferred = { x: drag.left + dx, y: drag.top + dy };
      layout();
    });
    function endDrag(event) {
      if (drag?.id !== event.pointerId) return;
      if (suppressClick) preferred = { x: widget.offsetLeft, y: widget.offsetTop };
      drag = null;
    }
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) toy.addEventListener(name, endDrag);
    toy.addEventListener("click", event => {
      if (!suppressClick || event.detail === 0) showGreeting(!greetingOpen);
      suppressClick = false;
    });
    close.addEventListener("click", () => {
      showGreeting(false);
      toy.focus({ preventScroll: true });
    });
    toy.addEventListener("keydown", event => {
      const step = event.shiftKey ? 32 : 12;
      const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
      if (!delta) return;
      event.preventDefault();
      preferred = { x: widget.offsetLeft + delta[0], y: widget.offsetTop + delta[1] };
      layout();
      preferred = { x: widget.offsetLeft, y: widget.offsetTop };
    });

    const observer = new ResizeObserver(layout);
    observer.observe(host);
    observer.observe(widget);
    const api = {
      layout,
      reset() { preferred = null; showGreeting(true); },
      setVisible(visible) { widget.hidden = !visible; if (visible) layout(); },
      destroy() {
        observer.disconnect();
        widget.remove();
        if (addedPosition) host.classList.remove("nong-mood-host");
        instances.delete(host);
      }
    };
    instances.set(host, api);
    layout();
    return api;
  }

  window.NongMood = { mount };
})();
