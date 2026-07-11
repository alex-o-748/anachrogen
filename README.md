# Anachrogen

A quick, projector-friendly party game for a room full of people: look at an
AI-generated illustration of a historical scene and decide, for each marked
detail, whether it is **authentic** or an **anachronism the model invented**.

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
   explanation:
   - 🔴 **Anachronism** — the model invented it (wrong era/culture).
   - 🟠 **Disputed** — anachronistic but genuinely contested.
   - 🟢 **Authentic** — real and period-correct, even if it looks wrong.

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
| `Esc` / `←` | Back to the gallery |
| `1`–`9` | (in the gallery) jump straight to a scene |
| `D` | Toggle **author mode** (for adding new images — see below) |

Clicking a marker or a list row highlights the pair, so you can point the room at
exactly the detail under discussion before revealing it.

## Adding a new scene

All content lives in **`scenes.js`** — it's the only file you edit.

1. Add the image to the repo (the three that ship live at the repo root; a
   subfolder such as `images/` works too — just match the `image` path).
2. Copy an existing scene block and fill in `id`, `title`, `date`, `location`,
   `image` (URL-encode spaces, e.g. `My%20Scene.png`), and the `items` list.
3. Each item needs a marker position (`x`, `y` as fractions of the image, `0`–`1`),
   a `verdict` (`"invented"`, `"disputed"`, `"authentic"`, or `"todo"`), a
   **neutral** `label` (don't give the answer away), and an `explanation` shown on
   reveal.
4. Optionally add a `sources` list of `{ title, url }` — Wikipedia articles that
   back the explanation. They appear as links under the explanation **on reveal**
   (so they never give the answer away up front), and let the room check the
   sourcing themselves. The existing scenes are already sourced this way.

**Placing markers the easy way:** open the scene, press `D` for author mode, and
click on the image where you want a marker. The exact `x: …, y: …` is shown and
copied to your clipboard — paste it straight into the item. Press `D` again to exit.

## Content status

- **Cahokia** and **The Black Death in Paris** — the anachronisms come from the
  session author; the *authentic decoys* were drafted here and are flagged with a
  comment in `scenes.js` — please verify them before presenting.
- **Hypatia of Alexandria** — the answer key is not written yet. Its markers sit on
  candidate details as a demo, but every verdict is `"todo"` (shown as a grey
  "Pending" badge). Replace them once the real key is ready.
