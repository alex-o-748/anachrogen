/* ============================================================
   Anachrogen — app logic
   Facilitator-driven "authentic or anachronistic?" reveal game.
   Depends on SCENES (scenes.js). No frameworks, no build.
   ============================================================ */

(function () {
  "use strict";

  const VERDICT_LABEL = {
    invented:  "Invented",
    unlikely:  "Unlikely",
    disputed:  "Disputed",
    plausible: "Plausible",
    authentic: "Authentic",
    todo:      "Pending",
  };

  // Solo mode collapses the five-point scale into a fair two-choice guess.
  // Items that are genuinely contested ("disputed") or not yet keyed ("todo")
  // have no fixed answer, so they're revealed but left out of the score.
  const SOLO_ANSWER = {
    invented:  "wrong",
    unlikely:  "wrong",
    plausible: "authentic",
    authentic: "authentic",
    // disputed, todo -> unscored
  };

  // ---- element refs ----
  const galleryEl   = document.getElementById("gallery");
  const gridEl      = document.getElementById("gallery-grid");
  const toolsEl     = document.getElementById("gallery-tools");
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

  const referenceEl      = document.getElementById("reference");
  const referenceImg     = document.getElementById("reference-img");
  const referenceCaption = document.getElementById("reference-caption");
  const referenceCredit  = document.getElementById("reference-credit");
  const referenceClose   = document.getElementById("reference-close");

  const btnBack    = document.getElementById("btn-back");
  const btnReset   = document.getElementById("btn-reset");
  const btnAll     = document.getElementById("btn-all");
  const btnCompare = document.getElementById("btn-compare");
  const btnNext    = document.getElementById("btn-next");

  // ---- solo (trivia) mode elements ----
  const modeToggle     = document.getElementById("mode-toggle");
  const scoreboardEl   = document.getElementById("scoreboard");
  const scoreboardText = document.getElementById("scoreboard-text");
  const scoreboardReset= document.getElementById("scoreboard-reset");
  const galleryFoot    = document.getElementById("gallery-foot");

  const soloAnswerEl   = document.getElementById("solo-answer");
  const soloQuestion   = document.getElementById("solo-question");
  const soloBtnAuth    = document.getElementById("solo-authentic");
  const soloBtnWrong   = document.getElementById("solo-wrong");
  const soloFeedback   = document.getElementById("solo-feedback");
  const soloNext       = document.getElementById("solo-next");
  const soloResults    = document.getElementById("solo-results");
  const soloResScore   = document.getElementById("solo-results-score");
  const soloResSession = document.getElementById("solo-results-session");
  const soloNextScene  = document.getElementById("solo-next-scene");
  const soloReplay     = document.getElementById("solo-replay");
  const soloMenu       = document.getElementById("solo-menu");

  // ---- state ----
  let current = null;      // active scene object
  let revealed = 0;        // how many verdicts revealed
  let authoring = false;   // author mode on/off
  let comparing = false;   // reference overlay on/off
  let managing = false;    // "manage hidden" mode: show hidden cards to restore

  // ---- mode: "solo" (self-play trivia) or "presenter" (live-audience reveal) ----
  const MODE_KEY = "anachrogen:mode";
  let mode = loadMode();

  // ---- solo play state ----
  let soloIndex = 0;         // which item the player is on
  let soloAnswered = false;  // has the current item been answered yet
  let sceneCorrect = 0;      // correct answers this scene
  let sceneScored = 0;       // scoreable items answered this scene
  // Running total for the sitting (in memory; a reload starts fresh).
  const session = { correct: 0, scored: 0, scenes: 0 };

  function loadMode() {
    try {
      const m = localStorage.getItem(MODE_KEY);
      return m === "presenter" ? "presenter" : "solo";
    } catch (_) {
      return "solo";
    }
  }
  function saveMode() {
    try { localStorage.setItem(MODE_KEY, mode); } catch (_) { /* ignore */ }
  }

  // ---- hidden scenes: which cards the presenter has tucked away ----
  // Persisted so a curated gallery survives a page reload during the event.
  const HIDDEN_KEY = "anachrogen:hidden";
  const hiddenIds = loadHidden();

  function loadHidden() {
    try {
      const raw = localStorage.getItem(HIDDEN_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (_) {
      return new Set();
    }
  }
  function saveHidden() {
    try {
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hiddenIds]));
    } catch (_) { /* private mode / storage full — hiding just won't persist */ }
  }

  // ---- completed scenes: which scenes the player has finished in solo mode ----
  // Persisted so the checkmarks survive a reload and track real progress.
  const COMPLETED_KEY = "anachrogen:completed";
  const completedIds = loadCompleted();

  function loadCompleted() {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (_) {
      return new Set();
    }
  }
  function saveCompleted() {
    try {
      localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completedIds]));
    } catch (_) { /* storage unavailable — progress just won't persist */ }
  }
  function markCompleted(id) {
    if (completedIds.has(id)) return;
    completedIds.add(id);
    saveCompleted();
    refreshCompletedUI();
  }
  // Reflect the completed set onto the gallery cards.
  function refreshCompletedUI() {
    gridEl.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("is-completed", completedIds.has(card.dataset.id));
    });
  }

  // ============================ GALLERY ============================

  function buildGallery() {
    gridEl.innerHTML = "";
    SCENES.forEach((scene, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = scene.id;

      const open = document.createElement("button");
      open.className = "card-open";
      open.type = "button";
      open.innerHTML = `
        <img class="card-thumb" src="${scene.image}" alt="" loading="lazy" />
        <div class="card-body">
          <span class="card-index">${i + 1}</span>
          <h2 class="card-title">${escapeHtml(scene.title)}</h2>
          <div class="card-date">${escapeHtml(scene.date)}</div>
        </div>`;
      open.addEventListener("click", () => openScene(scene));

      const toggle = document.createElement("button");
      toggle.className = "card-hide";
      toggle.type = "button";
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleHidden(scene.id);
      });

      const done = document.createElement("span");
      done.className = "card-done";
      done.setAttribute("aria-hidden", "true");
      done.innerHTML = "&#10003;"; // ✓ — shown when the scene is completed

      card.appendChild(open);
      card.appendChild(toggle);
      card.appendChild(done);
      gridEl.appendChild(card);
    });
    refreshHiddenUI();
    refreshCompletedUI();
  }

  function toggleHidden(id) {
    if (hiddenIds.has(id)) hiddenIds.delete(id);
    else hiddenIds.add(id);
    saveHidden();
    refreshHiddenUI();
  }

  function restoreAll() {
    hiddenIds.clear();
    saveHidden();
    managing = false;
    refreshHiddenUI();
  }

  // Reflect the current hidden set onto the cards and the tools bar.
  function refreshHiddenUI() {
    const anyHidden = hiddenIds.size > 0;
    if (!anyHidden) managing = false;
    gridEl.classList.toggle("show-hidden", managing);

    gridEl.querySelectorAll(".card").forEach((card) => {
      const hidden = hiddenIds.has(card.dataset.id);
      card.classList.toggle("is-hidden", hidden);
      const btn = card.querySelector(".card-hide");
      btn.innerHTML = hidden ? "&#8630;" : "&#10005;"; // ↺ restore : ✕ hide
      btn.title = hidden ? "Restore this scene" : "Hide this scene";
      btn.setAttribute("aria-label", btn.title);
    });

    const shown = SCENES.length - hiddenIds.size;
    toolsEl.innerHTML = "";
    if (!anyHidden) return;

    const status = document.createElement("span");
    status.className = "tools-status";
    status.textContent = `${shown} shown · ${hiddenIds.size} hidden`;

    const manageBtn = document.createElement("button");
    manageBtn.type = "button";
    manageBtn.className = "btn";
    manageBtn.textContent = managing ? "Done" : "Manage hidden";
    manageBtn.addEventListener("click", () => {
      managing = !managing;
      refreshHiddenUI();
    });

    toolsEl.appendChild(status);
    toolsEl.appendChild(manageBtn);

    if (managing) {
      const restoreBtn = document.createElement("button");
      restoreBtn.type = "button";
      restoreBtn.className = "btn";
      restoreBtn.textContent = "Restore all";
      restoreBtn.addEventListener("click", restoreAll);
      toolsEl.appendChild(restoreBtn);
    }
  }

  function showGallery() {
    setComparing(false);
    current = null;
    sceneEl.hidden = true;
    galleryEl.hidden = false;
    document.title = "Anachrogen — Authentic or Anachronistic?";
    updateScoreboard();
  }

  // ============================= SCENE =============================

  function openScene(scene) {
    current = scene;
    revealed = 0;

    titleEl.textContent  = scene.title;
    dateEl.textContent   = scene.date;
    promptEl.textContent = mode === "solo"
      ? "For each numbered marker, decide: is the detail authentic, or did the maker get it wrong?"
      : (scene.prompt || "Authentic or anachronistic?");
    // Most scenes are AI-generated; a few are real paintings that carry an
    // `attribution`, so describe those honestly rather than as AI output.
    imgEl.alt = scene.attribution
      ? scene.title + " — " + scene.attribution
      : scene.title + " — AI-generated illustration";
    imgEl.src = scene.image;

    buildMarkers(scene);
    buildList(scene);
    setupReference(scene);
    updateCounter();

    // reset any solo UI left over from a previous scene
    soloAnswerEl.hidden = true;
    soloResults.hidden = true;
    clearSoloMarks();

    galleryEl.hidden = true;
    sceneEl.hidden = false;
    document.title = `Anachrogen — ${scene.title}`;
    if (authoring) setAuthoring(false);

    if (mode === "solo") startSolo();
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
          <span class="item-mark" aria-hidden="true"></span>
          <span class="badge v-${item.verdict}" hidden>${VERDICT_LABEL[item.verdict] || "?"}</span>
        </div>
        <p class="item-explain">${escapeHtml(item.explanation)}</p>`;
      // In solo mode, tapping a row before you've answered it would skip the
      // guess — clicks only re-focus in presenter mode.
      li.addEventListener("click", () => { if (mode === "presenter") focusItem(item.n); });
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
    if (mode === "solo") { updateSoloCounter(); return; }
    const total = current.items.length;
    counterEl.textContent = `Revealed ${revealed} / ${total}`;
    btnNext.disabled = revealed >= total;
    btnAll.disabled  = revealed >= total;
    btnReset.disabled = revealed === 0;
    btnNext.textContent = revealed >= total ? "All revealed" : "Reveal next →";
  }

  // ============================ SOLO (TRIVIA) MODE ============================
  // Self-play: the player commits a guess on each marker, is scored, and sees
  // the explanation immediately. The five-point scale collapses to a fair
  // Authentic-vs-Wrong choice (see SOLO_ANSWER); contested/unkeyed items are
  // shown but not scored.

  function startSolo() {
    soloIndex = 0;
    soloAnswered = false;
    sceneCorrect = 0;
    sceneScored = 0;
    resetScene();          // clear any revealed verdicts/badges
    clearSoloMarks();
    soloResults.hidden = true;
    soloAnswerEl.hidden = false;
    soloShowCurrent();
  }

  function clearSoloMarks() {
    listEl.querySelectorAll(".item").forEach((li) => {
      li.classList.remove("answered-correct", "answered-wrong", "solo-current");
      const mark = li.querySelector(".item-mark");
      if (mark) mark.textContent = "";
    });
  }

  function soloShowCurrent() {
    const items = current.items;
    if (soloIndex >= items.length) { soloFinish(); return; }
    soloAnswered = false;
    const item = items[soloIndex];

    // spotlight the current row + marker without revealing the verdict
    clearFocus();
    listEl.querySelectorAll(".item.solo-current").forEach((el) => el.classList.remove("solo-current"));
    const li = listEl.querySelector(`.item[data-n="${item.n}"]`);
    const m  = markersEl.querySelector(`.marker[data-n="${item.n}"]`);
    if (li) { li.classList.add("solo-current"); li.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
    if (m)  m.classList.add("is-active");

    soloQuestion.innerHTML = `Marker <b>${item.n}</b> — ${escapeHtml(item.label)}`;
    soloFeedback.hidden = true;
    soloNext.hidden = true;
    soloBtnAuth.hidden = false;
    soloBtnWrong.hidden = false;
    soloBtnAuth.disabled = false;
    soloBtnWrong.disabled = false;
    updateSoloCounter();
  }

  function soloAnswer(choice) {
    if (!current || soloAnswered || mode !== "solo") return;
    const item = current.items[soloIndex];
    const truth = SOLO_ANSWER[item.verdict];   // "authentic" | "wrong" | undefined
    soloAnswered = true;

    revealItem(item);   // show the verdict badge + explanation for this row
    const li   = listEl.querySelector(`.item[data-n="${item.n}"]`);
    const mark = li ? li.querySelector(".item-mark") : null;

    soloBtnAuth.disabled = true;
    soloBtnWrong.disabled = true;

    if (truth === undefined) {
      // genuinely contested or not yet keyed — revealed, but doesn't count
      soloFeedback.className = "solo-feedback is-neutral";
      soloFeedback.innerHTML = `<b>No fixed answer.</b> ${escapeHtml(item.explanation)}`;
      if (mark) mark.textContent = "–";
    } else {
      sceneScored += 1;
      if (choice === truth) {
        sceneCorrect += 1;
        soloFeedback.className = "solo-feedback is-correct";
        soloFeedback.innerHTML = `<b>Correct!</b> ${escapeHtml(item.explanation)}`;
        if (li) li.classList.add("answered-correct");
        if (mark) mark.textContent = "✓";
      } else {
        soloFeedback.className = "solo-feedback is-wrong";
        const right = truth === "authentic" ? "authentic" : "something the maker got wrong";
        soloFeedback.innerHTML = `<b>Not quite — it's ${right}.</b> ${escapeHtml(item.explanation)}`;
        if (li) li.classList.add("answered-wrong");
        if (mark) mark.textContent = "✗";
      }
    }

    soloFeedback.hidden = false;
    soloBtnAuth.hidden = true;
    soloBtnWrong.hidden = true;
    soloNext.hidden = false;
    soloNext.textContent = (soloIndex + 1 >= current.items.length) ? "See results →" : "Next marker →";
    updateSoloCounter();
    soloNext.focus();
  }

  function soloAdvance() {
    if (!soloAnswered) return;
    soloIndex += 1;
    soloShowCurrent();
  }

  function soloFinish() {
    soloAnswerEl.hidden = true;
    listEl.querySelectorAll(".item.solo-current").forEach((el) => el.classList.remove("solo-current"));
    markersEl.querySelectorAll(".marker.is-active").forEach((el) => el.classList.remove("is-active"));

    session.correct += sceneCorrect;
    session.scored  += sceneScored;
    session.scenes  += 1;
    markCompleted(current.id);

    const pct = sceneScored ? Math.round((sceneCorrect / sceneScored) * 100) : 0;
    soloResScore.innerHTML = sceneScored
      ? `You scored <b>${sceneCorrect} / ${sceneScored}</b> (${pct}%)`
      : `Nothing to score on this scene.`;
    soloResSession.textContent =
      `This session: ${session.correct} / ${session.scored} correct across ${session.scenes} scene${session.scenes === 1 ? "" : "s"}.`;

    // Offer a straight hop to the next scene, so play flows without a detour
    // back through the gallery. Hidden on the last (visible) scene.
    const next = nextPlayableScene();
    soloNextScene.hidden = !next;
    if (next) soloNextScene.focus(); else soloMenu.focus();

    soloResults.hidden = false;
    updateSoloCounter();
    updateScoreboard();
  }

  // The next non-hidden scene after the current one, or null at the end.
  function nextPlayableScene() {
    if (!current) return null;
    const idx = SCENES.indexOf(current);
    for (let i = idx + 1; i < SCENES.length; i++) {
      if (!hiddenIds.has(SCENES[i].id)) return SCENES[i];
    }
    return null;
  }

  function openNextScene() {
    const next = nextPlayableScene();
    if (next) openScene(next);
    else showGallery();
  }

  function updateSoloCounter() {
    if (!current) return;
    const total = current.items.length;
    const at = Math.min(soloIndex + 1, total);
    counterEl.textContent = `Marker ${at} / ${total} · Score ${sceneCorrect}/${sceneScored}`;
  }

  function updateScoreboard() {
    const show = mode === "solo" && session.scored > 0;
    scoreboardEl.hidden = !show;
    if (show) {
      const pct = Math.round((session.correct / session.scored) * 100);
      scoreboardText.textContent = `This session: ${session.correct} / ${session.scored} correct (${pct}%)`;
    }
  }

  function resetSession() {
    session.correct = 0;
    session.scored = 0;
    session.scenes = 0;
    updateScoreboard();
  }

  // ---- switching between solo and presenter ----

  function setMode(next) {
    if (next !== "solo" && next !== "presenter") return;
    mode = next;
    saveMode();
    document.body.dataset.mode = mode;
    modeToggle.querySelectorAll(".mode-btn").forEach((b) =>
      b.classList.toggle("is-on", b.dataset.mode === mode));
    updateGalleryFoot();
    updateScoreboard();
    if (current) openScene(current);   // re-open the active scene under the new mode
  }

  function updateGalleryFoot() {
    galleryFoot.innerHTML = mode === "solo"
      ? "Pick a scene to play &middot; answer each marker &middot; some details that look wrong are real"
      : "Pick a scene to begin &middot; press <kbd>1</kbd>&ndash;<kbd>9</kbd> to jump straight in &middot; " +
        "hover a card and press <kbd>&times;</kbd> to hide it";
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

  // ============================ REFERENCE / COMPARE ============================
  // Optional real historical image for a scene, shown over the AI one so the
  // room can see the difference instead of only hearing it described.

  function setupReference(scene) {
    setComparing(false);
    const ref = scene.reference;
    btnCompare.hidden = !ref;
    referenceImg.removeAttribute("src");   // load lazily on first compare
    if (ref) {
      referenceCaption.textContent = ref.caption || "";
      referenceImg.alt = ref.alt || (scene.title + " — real reference image");
      if (ref.href) {
        referenceCredit.textContent = ref.credit || "Source";
        referenceCredit.href = ref.href;
        referenceCredit.hidden = false;
      } else {
        referenceCredit.hidden = true;
      }
    }
  }

  function toggleCompare() {
    if (!current || !current.reference) return;
    setComparing(!comparing);
  }

  function setComparing(on) {
    comparing = on && !!(current && current.reference);
    if (comparing && !referenceImg.getAttribute("src")) {
      referenceImg.src = current.reference.image;   // lazy first load
    }
    referenceEl.hidden = !comparing;
    btnCompare.classList.toggle("is-on", comparing);
    btnCompare.textContent = comparing ? "Hide reference" : "Compare ▲▼";
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
    if (sceneEl.hidden) {
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (SCENES[idx]) { e.preventDefault(); openScene(SCENES[idx]); }
      }
      return;
    }

    // in a scene — solo and presenter have different controls
    if (mode === "solo") { onSoloKey(e); return; }

    switch (e.key) {
      case " ":
      case "ArrowRight":
        e.preventDefault(); revealNext(); return;
      case "ArrowLeft":
      case "Escape":
        // Esc closes the reference overlay first, then leaves the scene.
        e.preventDefault();
        if (comparing) setComparing(false); else showGallery();
        return;
      case "a": case "A":
        e.preventDefault(); revealAll(); return;
      case "r": case "R":
        e.preventDefault(); resetScene(); return;
      case "c": case "C":
        e.preventDefault(); toggleCompare(); return;
      case "d": case "D":
        e.preventDefault(); setAuthoring(!authoring); return;
    }
  }

  // Solo keys: ←/1/A = Authentic, →/2/W = Got it wrong (spatially matching the
  // two buttons); once answered, Space/Enter/→ moves on; Esc leaves.
  function onSoloKey(e) {
    if (!soloResults.hidden) {
      // On the results screen: forward keys carry on to the next scene,
      // back keys return to the gallery.
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault(); openNextScene();
      } else if (e.key === "Escape" || e.key === "ArrowLeft") {
        e.preventDefault(); showGallery();
      }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); showGallery(); return; }

    if (!soloAnswered) {
      if (e.key === "1" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault(); soloAnswer("authentic");
      } else if (e.key === "2" || e.key === "ArrowRight" || e.key === "w" || e.key === "W") {
        e.preventDefault(); soloAnswer("wrong");
      }
    } else if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault(); soloAdvance();
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
  btnCompare.addEventListener("click", toggleCompare);
  btnNext.addEventListener("click", revealNext);
  referenceClose.addEventListener("click", () => setComparing(false));
  imgEl.addEventListener("click", onAuthorClick);
  document.addEventListener("keydown", onKey);

  // solo-mode controls
  soloBtnAuth.addEventListener("click", () => soloAnswer("authentic"));
  soloBtnWrong.addEventListener("click", () => soloAnswer("wrong"));
  soloNext.addEventListener("click", soloAdvance);
  soloNextScene.addEventListener("click", openNextScene);
  soloReplay.addEventListener("click", () => { if (current) openScene(current); });
  soloMenu.addEventListener("click", showGallery);
  scoreboardReset.addEventListener("click", resetSession);
  modeToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (btn) setMode(btn.dataset.mode);
  });

  buildGallery();
  setMode(mode);   // sync body/toggle/footer to the persisted mode
  showGallery();
})();
