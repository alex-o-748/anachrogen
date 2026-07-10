/* ============================================================
   Anachrogen — app logic
   Facilitator-driven "authentic or anachronistic?" reveal game.
   Depends on SCENES (scenes.js). No frameworks, no build.
   ============================================================ */

(function () {
  "use strict";

  const VERDICT_LABEL = {
    invented:  "Anachronism",
    disputed:  "Disputed",
    authentic: "Authentic",
    todo:      "Pending",
  };

  // ---- element refs ----
  const galleryEl   = document.getElementById("gallery");
  const gridEl      = document.getElementById("gallery-grid");
  const sceneEl     = document.getElementById("scene");
  const imgEl       = document.getElementById("scene-img");
  const markersEl   = document.getElementById("markers");
  const listEl      = document.getElementById("item-list");
  const titleEl     = document.getElementById("scene-title");
  const dateEl      = document.getElementById("scene-date");
  const promptEl    = document.getElementById("scene-prompt");
  const counterEl   = document.getElementById("counter");
  const canvasWrap  = document.querySelector(".canvas-wrap");
  const readoutEl   = document.getElementById("author-readout");

  const btnBack  = document.getElementById("btn-back");
  const btnReset = document.getElementById("btn-reset");
  const btnAll   = document.getElementById("btn-all");
  const btnNext  = document.getElementById("btn-next");

  // ---- state ----
  let current = null;      // active scene object
  let revealed = 0;        // how many verdicts revealed
  let authoring = false;   // author mode on/off

  // ============================ GALLERY ============================

  function buildGallery() {
    gridEl.innerHTML = "";
    SCENES.forEach((scene, i) => {
      const card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      card.innerHTML = `
        <img class="card-thumb" src="${scene.image}" alt="" loading="lazy" />
        <div class="card-body">
          <span class="card-index">${i + 1}</span>
          <h2 class="card-title">${escapeHtml(scene.title)}</h2>
          <div class="card-date">${escapeHtml(scene.date)}</div>
        </div>`;
      card.addEventListener("click", () => openScene(scene));
      gridEl.appendChild(card);
    });
  }

  function showGallery() {
    current = null;
    sceneEl.hidden = true;
    galleryEl.hidden = false;
    document.title = "Anachrogen — Authentic or Anachronistic?";
  }

  // ============================= SCENE =============================

  function openScene(scene) {
    current = scene;
    revealed = 0;

    titleEl.textContent  = scene.title;
    dateEl.textContent   = scene.date;
    promptEl.textContent = scene.prompt || "Authentic or anachronistic?";
    imgEl.alt = scene.title + " — AI-generated illustration";
    imgEl.src = scene.image;

    buildMarkers(scene);
    buildList(scene);
    updateCounter();

    galleryEl.hidden = true;
    sceneEl.hidden = false;
    document.title = `Anachrogen — ${scene.title}`;
    if (authoring) setAuthoring(false);
  }

  function buildMarkers(scene) {
    markersEl.innerHTML = "";
    scene.items.forEach((item) => {
      const m = document.createElement("button");
      m.type = "button";
      m.className = "marker";
      m.dataset.n = item.n;
      m.style.left = (item.x * 100) + "%";
      m.style.top  = (item.y * 100) + "%";
      m.textContent = item.n;
      m.title = item.label;
      m.addEventListener("click", () => focusItem(item.n));
      markersEl.appendChild(m);
    });
  }

  function buildList(scene) {
    listEl.innerHTML = "";
    scene.items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "item";
      li.dataset.n = item.n;
      li.innerHTML = `
        <div class="item-head">
          <span class="item-num">${item.n}</span>
          <span class="item-label">${escapeHtml(item.label)}</span>
          <span class="badge v-${item.verdict}" hidden>${VERDICT_LABEL[item.verdict] || "?"}</span>
        </div>
        <p class="item-explain">${escapeHtml(item.explanation)}</p>`;
      li.addEventListener("click", () => focusItem(item.n));
      listEl.appendChild(li);
    });
  }

  // ---- reveal logic ----

  function revealNext() {
    if (!current || revealed >= current.items.length) return;
    revealItem(current.items[revealed]);
    revealed += 1;
    updateCounter();
    focusItem(revealed, false); // highlight the just-revealed item
  }

  function revealAll() {
    if (!current) return;
    for (let i = revealed; i < current.items.length; i++) {
      revealItem(current.items[i]);
    }
    revealed = current.items.length;
    updateCounter();
    clearFocus();
  }

  function revealItem(item) {
    const li = listEl.querySelector(`.item[data-n="${item.n}"]`);
    const m  = markersEl.querySelector(`.marker[data-n="${item.n}"]`);
    if (li) {
      li.classList.add("revealed", "v-" + item.verdict);
      const badge = li.querySelector(".badge");
      if (badge) badge.hidden = false;
    }
    if (m) m.classList.add("revealed", "v-" + item.verdict);
  }

  function resetScene() {
    if (!current) return;
    revealed = 0;
    listEl.querySelectorAll(".item").forEach((li) => {
      li.className = "item";
      const badge = li.querySelector(".badge");
      if (badge) badge.hidden = true;
    });
    markersEl.querySelectorAll(".marker").forEach((m) => {
      m.className = "marker";
    });
    updateCounter();
  }

  function updateCounter() {
    if (!current) return;
    const total = current.items.length;
    counterEl.textContent = `Revealed ${revealed} / ${total}`;
    btnNext.disabled = revealed >= total;
    btnAll.disabled  = revealed >= total;
    btnReset.disabled = revealed === 0;
    btnNext.textContent = revealed >= total ? "All revealed" : "Reveal next →";
  }

  // ---- focus / highlight a single item + its marker ----

  function focusItem(n, scroll = true) {
    clearFocus();
    const li = listEl.querySelector(`.item[data-n="${n}"]`);
    const m  = markersEl.querySelector(`.marker[data-n="${n}"]`);
    if (li) {
      li.classList.add("is-active");
      if (scroll) li.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    if (m) m.classList.add("is-active");
  }

  function clearFocus() {
    listEl.querySelectorAll(".item.is-active").forEach((el) => el.classList.remove("is-active"));
    markersEl.querySelectorAll(".marker.is-active").forEach((el) => el.classList.remove("is-active"));
  }

  // ============================ AUTHOR MODE ============================
  // Press "D": click the image to copy fractional x,y for placing markers.

  function setAuthoring(on) {
    authoring = on;
    canvasWrap.classList.toggle("authoring", on);
    readoutEl.hidden = !on;
    if (on) {
      readoutEl.textContent = "author mode — click the image to copy x,y";
    } else {
      markersEl.querySelectorAll(".author-dot").forEach((d) => d.remove());
    }
  }

  function onAuthorClick(e) {
    if (!authoring || !current) return;
    const rect = imgEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    const xs = x.toFixed(3), ys = y.toFixed(3);
    const text = `x: ${xs}, y: ${ys},`;
    readoutEl.textContent = text + "  (copied)";

    // drop a temporary dot
    const dot = document.createElement("div");
    dot.className = "author-dot";
    dot.style.left = xs * 100 + "%";
    dot.style.top  = ys * 100 + "%";
    markersEl.appendChild(dot);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  // ============================ INPUT ============================

  function onKey(e) {
    // gallery: number keys pick a scene
    if (!sceneEl.hidden) {
      switch (e.key) {
        case " ":
        case "ArrowRight":
          e.preventDefault(); revealNext(); return;
        case "ArrowLeft":
        case "Escape":
          e.preventDefault(); showGallery(); return;
        case "a": case "A":
          e.preventDefault(); revealAll(); return;
        case "r": case "R":
          e.preventDefault(); resetScene(); return;
        case "d": case "D":
          e.preventDefault(); setAuthoring(!authoring); return;
      }
    } else {
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (SCENES[idx]) { e.preventDefault(); openScene(SCENES[idx]); }
      }
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  // ============================ WIRE UP ============================

  btnBack.addEventListener("click", showGallery);
  btnReset.addEventListener("click", resetScene);
  btnAll.addEventListener("click", revealAll);
  btnNext.addEventListener("click", revealNext);
  imgEl.addEventListener("click", onAuthorClick);
  document.addEventListener("keydown", onKey);

  buildGallery();
  showGallery();
})();
