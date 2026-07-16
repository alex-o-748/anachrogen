# Anachrogen

A quick, projector-friendly party game for a room full of people: look at an
illustration of a historical scene — most are AI-generated, a few are real
paintings by famous artists — and decide, for each marked detail, whether it is
**authentic** or something the maker **got wrong**. Some mistakes are true
anachronisms (something from the wrong era); others are just inaccuracies that
contradict the historical evidence.

Built for a ~15-minute Wikipedia-conference session with a few dozen people and
one shared screen. No accounts, no backend, no build step — it's plain HTML, CSS
and JavaScript.

## How it plays

1. **Pick a scene** from the gallery (or press a number key).
2. The image appears with a fixed set of **numbered markers already placed**, and
   a matching neutral list on the right. Some marked details are genuine period
   history; some are things the AI got wrong. The trick is that several *authentic*
   details look wrong, and some *invented* ones look convincing.
3. **Debate each item** with the room — a show of hands per marker works well.
4. **Reveal** the verdicts one at a time. Each gets a colored badge and a one-line
   explanation. Verdicts run on a five-point scale from clearly wrong to clearly
   right, so a detail can be graded on the *evidence*, not just true/false:
   - 🔴 **Invented** — got it wrong: a true anachronism (wrong era/culture) or an
     inaccuracy that contradicts the historical evidence.
   - 🟠 **Unlikely** — probably wrong; leans against the evidence, but not a flat
     impossibility.
   - 🟡 **Disputed** — genuinely contested/uncertain among scholars, with no
     settled answer.
   - 🫒 **Plausible** — no evidence *for* it, but none against either; period-possible,
     so not an error.
   - 🟢 **Authentic** — attested and period-correct, even if it looks wrong.

Three scenes ≈ 15 minutes with discussion.

## Running it

It's a static site. Any of these works:

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

or just open `index.html` in a browser (the author-mode clipboard copy works best
when served over http rather than `file://`).

**Deploying:** push to GitHub and enable **Settings → Pages → deploy from branch**
(root). The site works as-is with no configuration.

## Presenter keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` / `→` | Reveal the next verdict |
| `A` | Reveal all verdicts |
| `R` | Reset the scene (hide verdicts again) |
| `C` | Toggle the **real reference image** (scenes that have one — see below) |
| `Esc` / `←` | Close the reference image, or go back to the gallery |
| `1`–`9` | (in the gallery) jump straight to a scene |
| `D` | Toggle **author mode** (for adding new images — see below) |

Clicking a marker or a list row highlights the pair, so you can point the room at
exactly the detail under discussion before revealing it.

## Comparing against the real image

Some things are easier to *show* than to describe. A scene can carry an optional
**reference image** — the real historical picture the AI got wrong. When one is
present, a **Compare** button (or press `C`) overlays that real image over the
AI one so the room can see the difference directly, then toggle back.

Four scenes ship with a Wikimedia Commons reference: **Cahokia** (the real
asymmetric Monks Mound), **Zhang Heng's Seismoscope** (a portrait of Emperor
Guangwu of Han, for the robe-colour point), **Nalanda at its Height** (a
surviving sculpted relief vs. the bare excavated brick), and **Lovelace, Babbage
& the Analytical Engine** (a period engraving of Babbage, for the impossible
age pairing).

These four are **hotlinked** from Commons via stable `Special:FilePath` URLs, so
they load in a normal browser but need network access. To make the site fully
self-contained, download each file into `assets/` and point the scene's
`reference.image` at the local copy. Add a reference to any scene by giving it a
`reference` object (`image`, `caption`, `credit`, `href`) — see the comment at
the top of `scenes.js`.

## Adding a new scene

All content lives in **`scenes.js`** — it's the only file you edit.

1. Add the image to the repo under `assets/` (that's where the scene images live;
   any path works as long as it matches the `image` field).
2. Copy an existing scene block and fill in `id`, `title`, `date`, `location`,
   `image` (URL-encode spaces, e.g. `My%20Scene.png`), and the `items` list.
3. Each item needs a marker position (`x`, `y` as fractions of the image, `0`–`1`),
   a `verdict` (`"invented"`, `"unlikely"`, `"disputed"`, `"plausible"`,
   `"authentic"`, or `"todo"`), a **neutral** `label` (don't give the answer away),
   and an `explanation` shown on reveal. A scene that is a real artwork rather than
   an AI image can also set `attribution` (e.g. `"Jean-Léon Gérôme, 1866"`), which
   is used for its alt text instead of the default "AI-generated illustration".

**Placing markers the easy way:** open the scene, press `D` for author mode, and
click on the image where you want a marker. The exact `x: …, y: …` is shown and
copied to your clipboard — paste it straight into the item. Press `D` again to exit.

## Content status

- **Cahokia** and **The Black Death in Paris** — the invented details come from the
  session author; the *authentic decoys* were drafted here and are flagged with a
  comment in `scenes.js` — please verify them before presenting.
- **Hypatia of Alexandria** — the answer key is not written yet. Its markers sit on
  candidate details as a demo, but every verdict is `"todo"` (shown as a grey
  "Pending" badge). Replace them once the real key is ready.
- **Zhang Heng's Seismoscope**, **Nalanda at its Height**, **Lovelace, Babbage &
  the Analytical Engine**, and **Zheng He's Treasure Fleet** — answer keys are
  written and the images are in `assets/`, but the marker `x, y` coordinates are
  still **placeholders**: open each scene and re-place the markers with author
  mode (press `D`). Two verdicts are deliberately left as `"todo"` pending a
  source check: the emperor's robe colour (Zhang Heng) and the single-character
  `明` banner (Treasure Fleet).
- **Cleopatra and Caesar** (Jean-Léon Gérôme, 1866) and **The Meeting of Antony
  and Cleopatra** (Sir Lawrence Alma-Tadema, 1885) — the closing pair, and the
  twist: these are *real* history paintings, not AI images (flagged with
  `attribution`). They show the same anachronistic instincts in celebrated human
  artists. Answer keys are written; marker `x, y` are placed but worth a quick
  check in author mode (press `D`) before presenting.

All scene images live under **`assets/`**.
