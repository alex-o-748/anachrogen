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
 *   verdict:     "invented"  -> anachronism the model fabricated   (red badge)
 *                "disputed"  -> anachronism, but contested/uncertain (amber badge)
 *                "authentic" -> real & period-correct, just looks wrong (green badge)
 *                "todo"      -> answer key not written yet          (grey "Pending")
 *   label:       NEUTRAL description shown up front. Must NOT reveal the verdict,
 *                e.g. "The tall feathered headdress" — never "invented headdress".
 *   explanation: the payoff text, shown only when the verdict is revealed.
 *   sources:     OPTIONAL array of { title, url } links backing the explanation.
 *                Shown with the explanation on reveal (so they don't give the
 *                answer away up front). These are Wikipedia articles — this is a
 *                Wikipedia event, and they make the sourcing checkable.
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
    image: "Cahokia(1).png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    items: [
      {
        n: 1,
        x: 0.665, y: 0.34,
        verdict: "invented",
        label: "The stone-edged staircases climbing the mound",
        explanation:
          "Invented. Cahokia had no stone architecture; access to the real Monks Mound was a single wooden stairway on the south face. The model imported a Maya/Aztec pyramid schema.",
        sources: [
          { title: "Monks Mound", url: "https://en.wikipedia.org/wiki/Monks_Mound" },
          { title: "Cahokia", url: "https://en.wikipedia.org/wiki/Cahokia" },
        ],
      },
      {
        n: 2,
        x: 0.83, y: 0.24,
        verdict: "invented",
        label: "The symmetric, tiered-pyramid silhouette of the mound",
        explanation:
          "Invented. Same contamination — the real mound is asymmetric, with four uneven terraces, not a neat symmetrical pyramid.",
        sources: [
          { title: "Monks Mound", url: "https://en.wikipedia.org/wiki/Monks_Mound" },
          { title: "Platform mound", url: "https://en.wikipedia.org/wiki/Platform_mound" },
        ],
      },
      {
        n: 3,
        x: 0.78, y: 0.49,
        verdict: "invented",
        label: "The tall upright feather headdress on the elite figure",
        explanation:
          "Invented. That's Plains war-bonnet iconography — wrong era and culture. Mississippian elite regalia (shell gorgets, copper plates, Birdman motifs) looks nothing like it.",
        sources: [
          { title: "War bonnet", url: "https://en.wikipedia.org/wiki/War_bonnet" },
          { title: "Southeastern Ceremonial Complex", url: "https://en.wikipedia.org/wiki/Southeastern_Ceremonial_Complex" },
        ],
      },
      // --- Authentic decoys below: DRAFTED — please verify before the session. ---
      {
        n: 4,
        x: 0.42, y: 0.43,
        verdict: "authentic",
        label: "The upright wooden palisade of posts",
        explanation:
          "Authentic. Cahokia was ringed by a large bastioned log stockade, rebuilt several times — a wooden palisade like this is well attested.",
        sources: [
          { title: "Cahokia", url: "https://en.wikipedia.org/wiki/Cahokia" },
          { title: "Palisade", url: "https://en.wikipedia.org/wiki/Palisade" },
        ],
      },
      {
        n: 5,
        x: 0.925, y: 0.44,
        verdict: "authentic",
        label: "The steep thatched-roof buildings",
        explanation:
          "Authentic. Mississippian buildings were pole-frame structures with thatched or mat-covered roofs; the form is broadly right for the period.",
        sources: [
          { title: "Mississippian culture", url: "https://en.wikipedia.org/wiki/Mississippian_culture" },
        ],
      },
      {
        n: 6,
        x: 0.155, y: 0.82,
        verdict: "authentic",
        label: "The hand-built pottery worked in the foreground",
        explanation:
          "Authentic. Cahokians were skilled potters, making shell-tempered coil-built vessels by hand — no wheel, exactly as shown.",
        sources: [
          { title: "Mississippian culture pottery", url: "https://en.wikipedia.org/wiki/Mississippian_culture_pottery" },
        ],
      },
    ],
  },

  {
    id: "black-death-paris",
    title: "The Black Death in Paris",
    date: "1348",
    location: "Paris, during the plague",
    image: "Black%20Death%20in%20Paris(1).png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    items: [
      {
        n: 1,
        x: 0.34, y: 0.42,
        verdict: "invented",
        label: "The figure in the long-beaked bird mask",
        explanation:
          "Invented. The beaked plague-doctor costume dates to ~1619 (Charles de Lorme); the iconic image is a 1656 engraving — nearly three centuries too late for 1348.",
        sources: [
          { title: "Plague doctor costume", url: "https://en.wikipedia.org/wiki/Plague_doctor_costume" },
          { title: "Charles de Lorme", url: "https://en.wikipedia.org/wiki/Charles_de_Lorme" },
        ],
      },
      {
        n: 2,
        x: 0.745, y: 0.11,
        verdict: "invented",
        label: "The lantern hanging over the street",
        explanation:
          "Invented. Public street lighting in Paris begins under La Reynie in 1667 — there were no fixed street lanterns like this in 1348.",
        sources: [
          { title: "Street light — history", url: "https://en.wikipedia.org/wiki/Street_light#History" },
          { title: "Gabriel Nicolas de la Reynie", url: "https://en.wikipedia.org/wiki/Gabriel_Nicolas_de_la_Reynie" },
        ],
      },
      {
        n: 3,
        x: 0.09, y: 0.44,
        verdict: "disputed",
        label: "The red cross painted to mark the house",
        explanation:
          "Disputed. Marking infected houses with a red cross is documented for later plagues (London, 1665); it is not attested for 1348 Paris.",
        sources: [
          { title: "Great Plague of London", url: "https://en.wikipedia.org/wiki/Great_Plague_of_London" },
        ],
      },
      // --- Authentic decoys below: DRAFTED — please verify before the session. ---
      {
        n: 4,
        x: 0.635, y: 0.29,
        verdict: "authentic",
        label: "The twin-towered cathedral rising in the distance",
        explanation:
          "Authentic. Notre-Dame de Paris was essentially complete — its west front and towers finished by ~1345 — so it would indeed loom over the city in 1348.",
        sources: [
          { title: "Notre-Dame de Paris", url: "https://en.wikipedia.org/wiki/Notre-Dame_de_Paris" },
        ],
      },
      {
        n: 5,
        x: 0.505, y: 0.60,
        verdict: "authentic",
        label: "The cart carrying bodies through the street",
        explanation:
          "Authentic. With mortality overwhelming the city, corpses were collected by cart for mass burial — a grimly accurate detail of the 1348 outbreak.",
        sources: [
          { title: "Black Death", url: "https://en.wikipedia.org/wiki/Black_Death" },
        ],
      },
      {
        n: 6,
        x: 0.30, y: 0.16,
        verdict: "authentic",
        label: "The half-timbered (timber-framed) houses",
        explanation:
          "Authentic. Timber-framed 'colombage' houses with jettied upper floors were typical of medieval Paris streets in this period.",
        sources: [
          { title: "Timber framing", url: "https://en.wikipedia.org/wiki/Timber_framing" },
          { title: "Jettying", url: "https://en.wikipedia.org/wiki/Jettying" },
        ],
      },
    ],
  },

  {
    id: "hypatia",
    title: "Hypatia of Alexandria",
    date: "~400 CE",
    location: "Alexandria, Roman Egypt",
    image: "Hypatia(1).png",
    prompt: "Authentic or anachronistic? Debate each marked detail, then reveal.",
    // Answer key supplied by the facilitator: 2 anachronisms (paper flip-chart /
    // notebooks, and Hypatia's clothing) + 2 authentic decoys (codices, armillary
    // sphere). NOTE: please confirm the intended reason for the clothing verdict —
    // the explanation on item 4 is a draft.
    items: [
      {
        n: 1,
        x: 0.545, y: 0.42,
        verdict: "invented",
        label: "The large paper pad on the standing easel",
        explanation:
          "Invented. A big paper pad on an easel — and the paper notebooks people are writing in — is a modern lecture prop. Pulp paper didn't reach the Mediterranean for centuries; a teacher in ~400 CE Alexandria would sketch on a wax tablet or dust-board and read from papyrus scrolls or parchment codices.",
        sources: [
          { title: "History of paper", url: "https://en.wikipedia.org/wiki/History_of_paper" },
          { title: "Wax tablet", url: "https://en.wikipedia.org/wiki/Wax_tablet" },
        ],
      },
      {
        n: 2,
        x: 0.215, y: 0.24,
        verdict: "authentic",
        label: "The bound books stacked on the shelf",
        explanation:
          "Authentic. By ~400 CE the bound codex was already displacing the scroll across late antiquity, so books in this bound form are period-correct — even though they read as 'medieval.'",
        sources: [
          { title: "Codex", url: "https://en.wikipedia.org/wiki/Codex" },
        ],
      },
      {
        n: 3,
        x: 0.085, y: 0.40,
        verdict: "authentic",
        label: "The brass armillary sphere at the left",
        explanation:
          "Authentic. The armillary sphere goes back to Hellenistic astronomers such as Hipparchus and Eratosthenes, so one beside Hypatia — a celebrated astronomer and mathematician — is entirely plausible.",
        sources: [
          { title: "Armillary sphere", url: "https://en.wikipedia.org/wiki/Armillary_sphere" },
          { title: "Hypatia", url: "https://en.wikipedia.org/wiki/Hypatia" },
        ],
      },
      {
        n: 4,
        x: 0.38, y: 0.47,
        verdict: "invented",
        label: "The draped gown Hypatia is wearing",
        explanation:
          "Invented. The clean white-and-gold 'Grecian goddess' gown owes more to 19th-century Romantic paintings of Hypatia than to late-Roman Alexandrian dress; a woman of her rank in Christianizing ~400 CE Egypt would more likely wear a fuller tunica with a palla, and probably a veil. (Facilitator: confirm the intended reason.)",
        sources: [
          { title: "Hypatia — in art", url: "https://en.wikipedia.org/wiki/Hypatia#In_art" },
          { title: "Palla (garment)", url: "https://en.wikipedia.org/wiki/Palla_(garment)" },
        ],
      },
    ],
  },
];
