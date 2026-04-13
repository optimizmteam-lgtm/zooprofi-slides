(function () {
  const deck = document.getElementById("deck");
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll(".slide"));
  const total = slides.length;
  let index = 0;

  const counter = document.querySelector("[data-deck-counter]");
  const dots = document.getElementById("deck-dots");
  const btnPrev = document.querySelector('[data-deck-prev]');
  const btnNext = document.querySelector('[data-deck-next]');
  const btnFs = document.querySelector('[data-deck-fullscreen]');

  function render() {
    slides.forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
      el.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    if (counter) counter.textContent = index + 1 + " / " + total;
    if (dots) {
      dots.querySelectorAll("button").forEach((b, i) => {
        b.classList.toggle("is-active", i === index);
        b.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }
    history.replaceState(null, "", "#" + index);
  }

  function go(to) {
    index = Math.max(0, Math.min(total - 1, to));
    render();
  }

  function next() {
    go(index + 1);
  }

  function prev() {
    go(index - 1);
  }

  const hash = parseInt(location.hash.slice(1), 10);
  if (!Number.isNaN(hash) && hash >= 0 && hash < total) index = hash;

  if (dots && slides.length) {
    dots.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "deck-dot";
      b.setAttribute("aria-label", "Слайд " + (i + 1));
      b.addEventListener("click", function () {
        go(i);
      });
      dots.appendChild(b);
    });
  }

  btnPrev && btnPrev.addEventListener("click", prev);
  btnNext && btnNext.addEventListener("click", next);

  btnFs &&
    btnFs.addEventListener("click", function () {
      const root = document.documentElement;
      if (!document.fullscreenElement) {
        root.requestFullscreen && root.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
    }
  });

  let touchStartX = 0;
  deck.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  deck.addEventListener(
    "touchend",
    function (e) {
      const x = e.changedTouches[0].screenX;
      const d = x - touchStartX;
      if (d < -48) next();
      if (d > 48) prev();
    },
    { passive: true }
  );

  render();
})();
