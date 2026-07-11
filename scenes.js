/*
 * Anachrogen — scene data
 * =======================
 * This is the ONLY file you need to edit to add or change game content.
 *
 * Each scene is one AI-generated historical image plus a fixed set of marked
 * `items`. The audience judges each marked item: authentic, or an anachronism?
 *
 * item = {
 *   n:           number shown on the marker + list (1-based, in reveal order)
 *   x, y:        marker position as a FRACTION of the image (0..1).
 *                x = 0 is the left edge, 1 the right edge; y = 0 top, 1 bottom.
 *                Tip: open the app, press "D" for author mode, then click the
 *                image — the x,y under your cursor is copied to the clipboard.
 *   verdict:     "invented"  -> the model got it wrong: an anachronism, or an
 *                              inaccuracy that contradicts the evidence (red badge)
 *                "disputed"  -> likely wrong, but contested/uncertain  (amber badge)
 *                "authentic" -> real & period-correct, just looks wrong (green badge)
 *                "todo"      -> answer key not written yet          (grey "Pending")
 *   label:       NEUTRAL description shown up front. Must NOT reveal the verdict,
 *                e.g. "The tall feathered headdress" — never "invented headdress".
 *   explanation: the payoff text, shown only when the verdict is revealed.
 * }
 *
 * To add a scene: add the image to the repo, copy a block below, and fill it in.
 * (URL-encode spaces in the image path, e.g. "My%20Scene.png".)
 */

const SCENES = [
  {
    id: "cahokia",
    title: "Cahokia",
    date: "~1100 CE",
    location: "Mississippian culture · near present-day St. Louis",
    image: "assets/Cahokia(1).png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // Verdicts are deliberately interleaved (not all anachronisms first) so the
    // reveal order doesn't give the game away.
    // Authentic decoys: DRAFTED — please verify before the session.
    items: [
      {
        n: 1,
        x: 0.665, y: 0.34,
        verdict: "invented",
        label: "The stone-edged staircases climbing the mound",
        explanation:
          "Invented. Cahokia had no stone architecture; access to the real Monks Mound was a single wooden stairway on the south face. The model imported a Maya/Aztec pyramid schema.",
      },
      {
        n: 2,
        x: 0.925, y: 0.44,
        verdict: "authentic",
        label: "The steep thatched-roof buildings",
        explanation:
          "Authentic. Mississippian buildings were pole-frame structures with thatched or mat-covered roofs; the form is broadly right for the period.",
      },
      {
        n: 3,
        x: 0.83, y: 0.24,
        verdict: "invented",
        label: "The symmetric, tiered-pyramid silhouette of the mound",
        explanation:
          "Invented. Same contamination — the real mound is asymmetric, with four uneven terraces, not a neat symmetrical pyramid.",
      },
      {
        n: 4,
        x: 0.155, y: 0.82,
        verdict: "authentic",
        label: "The hand-built pottery worked in the foreground",
        explanation:
          "Authentic. Cahokians were skilled potters, making shell-tempered coil-built vessels by hand — no wheel, exactly as shown.",
      },
      {
        n: 5,
        x: 0.78, y: 0.49,
        verdict: "invented",
        label: "The tall upright feather headdress on the elite figure",
        explanation:
          "Invented. That's Plains war-bonnet iconography — wrong era and culture. Mississippian elite regalia (shell gorgets, copper plates, Birdman motifs) looks nothing like it.",
      },
    ],
  },

  {
    id: "black-death-paris",
    title: "The Black Death in Paris",
    date: "1348",
    location: "Paris, during the plague",
    image: "assets/Black%20Death%20in%20Paris(1).png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // Verdicts are deliberately interleaved (not all anachronisms first) so the
    // reveal order doesn't give the game away.
    // Authentic decoys: DRAFTED — please verify before the session.
    items: [
      {
        n: 1,
        x: 0.34, y: 0.42,
        verdict: "invented",
        label: "The figure in the long-beaked bird mask",
        explanation:
          "Invented. The beaked plague-doctor costume dates to ~1619 (Charles de Lorme); the iconic image is a 1656 engraving — nearly three centuries too late for 1348.",
      },
      {
        n: 2,
        x: 0.635, y: 0.29,
        verdict: "authentic",
        label: "The twin-towered cathedral rising in the distance",
        explanation:
          "Authentic. Notre-Dame de Paris was essentially complete — its west front and towers finished by ~1345 — so it would indeed loom over the city in 1348.",
      },
      {
        n: 3,
        x: 0.745, y: 0.11,
        verdict: "invented",
        label: "The lantern hanging over the street",
        explanation:
          "Invented. Public street lighting in Paris begins under La Reynie in 1667 — there were no fixed street lanterns like this in 1348.",
      },
      {
        n: 4,
        x: 0.505, y: 0.60,
        verdict: "authentic",
        label: "The cart carrying bodies through the street",
        explanation:
          "Authentic. With mortality overwhelming the city, corpses were collected by cart for mass burial — a grimly accurate detail of the 1348 outbreak.",
      },
      {
        n: 5,
        x: 0.09, y: 0.44,
        verdict: "disputed",
        label: "The red cross painted to mark the house",
        explanation:
          "Disputed. Marking infected houses with a red cross is documented for later plagues (London, 1665); it is not attested for 1348 Paris.",
      },
    ],
  },

  {
    id: "hypatia",
    title: "Hypatia of Alexandria",
    date: "~400 CE",
    location: "Alexandria, Roman Egypt",
    image: "assets/Hypatia(1).png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // Answer key supplied by the facilitator: 2 anachronisms (the flip-chart pad /
    // notebooks, and Hypatia's clothing) + 2 authentic decoys (codices, armillary
    // sphere).
    items: [
      {
        n: 1,
        x: 0.545, y: 0.42,
        verdict: "invented",
        label: "The large flip-chart pad on the standing easel",
        explanation:
          "Invented. A big flip-chart pad on an easel — and the notebooks people are writing in — is a modern lecture prop. Pulp paper didn't reach the Mediterranean for centuries; and even a papyrus 'pad' of this size is unrealistic, since papyrus was far too costly to gesture through by the sheet. A teacher in ~400 CE Alexandria would sketch on a reusable wax tablet or dust-board.",
      },
      {
        n: 2,
        x: 0.215, y: 0.24,
        verdict: "authentic",
        label: "The bound books stacked on the shelf",
        explanation:
          "Authentic. By ~400 CE the bound codex was already displacing the scroll across late antiquity, so books in this bound form are period-correct — even though they read as 'medieval.'",
      },
      {
        n: 3,
        x: 0.085, y: 0.40,
        verdict: "authentic",
        label: "The brass armillary sphere at the left",
        explanation:
          "Authentic. The armillary sphere goes back to Hellenistic astronomers such as Hipparchus and Eratosthenes, so one beside Hypatia — a celebrated astronomer and mathematician — is entirely plausible.",
      },
      {
        n: 4,
        x: 0.38, y: 0.47,
        verdict: "invented",
        label: "The draped gown Hypatia is wearing",
        explanation:
          "Invented. The clean white-and-gold 'Grecian goddess' gown owes more to 19th-century Romantic paintings of Hypatia than to how she actually dressed. Our sources describe Hypatia as notably modest: she went about in the tribon, the plain philosopher's cloak, rather than any fine gown — a deliberate mark of her standing as a philosopher.",
      },
    ],
  },

  {
    id: "zhang-heng-seismoscope",
    title: "Zhang Heng's Seismoscope",
    date: "132 CE",
    location: "Eastern Han court · Luoyang, China",
    image: "assets/Seismoscope.png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // NOTE: marker x,y below are PLACEHOLDERS — re-place each with author mode
    // (press "D", click the image, paste the copied x,y).
    // Verdicts are deliberately interleaved so the reveal order doesn't tip the game.
    items: [
      {
        n: 1,
        x: 0.62, y: 0.60,
        verdict: "authentic",
        label: "The eight dragons and open-mouthed toads ringing the vessel",
        explanation:
          "Authentic — and the best-attested detail in the scene. The Book of the Later Han describes exactly this: eight dragon heads holding bronze balls around the vessel, each above a toad waiting open-mouthed below. It looks fantastical, but it's real. The catch is everything around them: no description or image of the actual 132 CE instrument survives, so the overall device — the wine-jar body, domed lid and descending dragons — is really the 20th-century Wang Zhenduo museum reconstruction, whose mechanism seismologists dispute. The dragons and toads are solid; the shape they hang on is guesswork, so the device as a whole is disputable.",
      },
      {
        n: 2,
        x: 0.214, y: 0.410,
        verdict: "invented",
        label: "The high-backed chair the emperor sits on",
        explanation:
          "Invented. Han China was a mat-and-low-platform culture — people knelt or sat on mats, and chairs barely existed (the folding stool arrives later as an exotic import). An authentic court scene would put the emperor on a raised dais with officials kneeling on mats, not seated in a chair with courtiers standing. The elevation is fine; the chair and the standing are the anachronisms.",
      },
      {
        n: 3,
        x: 0.22, y: 0.55,
        verdict: "authentic",
        label: "The scene of the instrument being demonstrated at court",
        explanation:
          "Authentic. Zhang Heng was the imperial astronomer, and the device's court debut — met with initial scepticism until a dragon dropped its ball toward a quake no one in the capital had yet felt — is the famous, well-documented story.",
      },
      {
        n: 4,
        x: 0.140, y: 0.428,
        verdict: "invented",
        label: "The emperor's yellow robes",
        explanation:
          "Invented. Bright imperial yellow as the emperor's exclusive colour is a later Tang-and-after convention. The Eastern Han venerated the Fire phase (red), and its court dress didn't privilege yellow the way the picture does — the signal-yellow robe reads the later 'only the emperor wears yellow' rule back onto a court that never followed it.",
      },
    ],
  },

  {
    id: "nalanda",
    title: "Nalanda at its Height",
    date: "~700 CE",
    location: "Mahavihara (monastic university) · Magadha, India",
    image: "assets/Nalanda.png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // NOTE: marker x,y below are PLACEHOLDERS — re-place each with author mode
    // (press "D", click the image, paste the copied x,y).
    items: [
      {
        n: 1,
        x: 0.30, y: 0.58,
        verdict: "authentic",
        label: "The monks' saffron and ochre robes",
        explanation:
          "Authentic. Saffron and ochre monastic robes are entirely right for a Buddhist mahavihara of this period.",
      },
      {
        n: 2,
        x: 0.45, y: 0.62,
        verdict: "invented",
        label: "The bound books in the monks' hands",
        explanation:
          "Invented. Indian manuscripts of 700 CE were pothi — loose oblong palm-leaf folios strung between wooden boards and read horizontally, not bound codices with a spine. The bound book arrives in India centuries later.",
      },
      {
        n: 3,
        x: 0.72, y: 0.72,
        verdict: "authentic",
        label: "The flowering groves in the grounds",
        explanation:
          "Authentic. Xuanzang specifically describes Nalanda's lakes of blue lotus and its groves of flowering mango — among the best-attested features of the site.",
      },
      {
        n: 4,
        x: 0.25, y: 0.40,
        verdict: "invented",
        label: "The red-brick architecture",
        explanation:
          "Invented. The exposed red-brick look is the modern archaeological site as it stands today — the left structure is recognisably the Sariputra stupa (Temple 3) as excavated. In 700 CE the buildings were plastered, stuccoed and painted; Xuanzang describes ornamented, coloured buildings, and stucco traces survive. The model dressed up the ruined present of the place, not its living form.",
      },
    ],
  },

  {
    id: "analytical-engine",
    title: "Lovelace, Babbage & the Analytical Engine",
    date: "1830s–40s",
    location: "London",
    image: "assets/Lovelace.png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // NOTE: marker x,y below are PLACEHOLDERS — re-place each with author mode
    // (press "D", click the image, paste the copied x,y).
    items: [
      {
        n: 1,
        x: 0.30, y: 0.42,
        verdict: "authentic",
        label: "Ada Lovelace's dress and hair",
        explanation:
          "Authentic. Her dress and hairstyle are faithful to her actual portraits — correct in isolation. The catch is in combination, once you look at the ages of the two figures.",
      },
      {
        n: 2,
        x: 0.70, y: 0.55,
        verdict: "invented",
        label: "The analytical engine",
        explanation:
          "Invented — it's the wrong engine. Uniform columns of stacked figure-wheels are the Difference Engine (echoing the Science Museum's completed No. 2, the dominant image online). The Analytical Engine — the one that would have been a computer — had a separate 'mill' and 'store' at room scale, and was never built.",
      },
      {
        n: 3,
        x: 0.45, y: 0.30,
        verdict: "invented",
        label: "The two figures together",
        explanation:
          "Invented — an impossible pairing. Ada is the ~20-year-old of the 1836 Carpenter portrait; Babbage is the grey man of the 1860s photographs. Each face is faithful to a real source, but the combination can't exist: when she looked like that he was in his mid-40s, and by the time he looked like that she had been dead a decade.",
      },
    ],
  },

  {
    id: "treasure-fleet",
    title: "Zheng He's Treasure Fleet",
    date: "~1410",
    location: "Ming dynasty · China",
    image: "assets/Treasure%20fleet.png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // NOTE: marker x,y below are PLACEHOLDERS — re-place each with author mode
    // (press "D", click the image, paste the copied x,y).
    // This is the "disputed sources" round: the size figures come from the same
    // contested accounts any verdict has to cite — that recursion is the lesson.
    items: [
      {
        n: 1,
        x: 0.40, y: 0.30,
        verdict: "authentic",
        label: "The battened sails and multi-masted junk rig",
        explanation:
          "Authentic. Battened lugsails, multiple masts and the escort-vessel proportions are all well within the well-documented Chinese junk tradition.",
      },
      {
        n: 2,
        x: 0.85, y: 0.55,
        verdict: "invented",
        label: "The characters 寶船 painted across the stern",
        explanation:
          "Invented. 寶船 simply means 'treasure ship' — the generic class name for these vessels. Painting it on the hull is like writing BATTLESHIP across a battleship's stern: caption logic bleeding onto the artefact. The well-formed calligraphy makes it sneaky.",
      },
      {
        n: 3,
        x: 0.50, y: 0.62,
        verdict: "disputed",
        label: "The sheer size of the ship",
        explanation:
          "Historians disagree. The image commits to the maximalist ~440-foot reading of the figures in the Ming shi (History of Ming). Many naval historians think a wooden hull at that scale is structurally implausible and put the real ships at roughly half. This is the round's live argument, not a settled error — and the size figures come from the same contested account any verdict has to cite.",
      },
    ],
  },
];
