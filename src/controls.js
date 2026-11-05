const Jt = Object.freeze({
  up: "KeyW",
  down: "KeyS",
  left: "KeyA",
  right: "KeyD",
  rollLeft: "KeyQ",
  rollRight: "KeyE",
  fire: "Space",
  boost: "ShiftLeft",
  missile: "KeyF",
  pause: "KeyP",
  brake: "KeyB",
  camera: "KeyV",
});
function qa(i = {}, e = 0) {
  const s = {},
    t = new Set(),
    n = Object.keys(Jt),
    o = (r) =>
      typeof r == "string" &&
      /^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|Shift(Left|Right)|Enter)$/.test(
        r,
      );
  e < 2 &&
    ((s.rollLeft = "KeyQ"),
    (s.rollRight = "KeyE"),
    t.add("KeyQ"),
    t.add("KeyE"));
  // Give the new camera binding V on upgrade; relocate an older conflicting bind.
  if (e < 3) {
    s.camera = "KeyV";
    t.add("KeyV");
  }
  for (const r of n) {
    if (s[r]) continue;
    const a = [
      i[r],
      Jt[r],
      "KeyF",
      "KeyR",
      "KeyT",
      "KeyG",
      "KeyH",
      "KeyJ",
      "KeyK",
      "KeyL",
      "KeyZ",
      "KeyX",
      "KeyC",
      "KeyV",
      "KeyB",
      "KeyN",
      "KeyM",
      "KeyU",
      "KeyI",
      "KeyO",
      "Digit1",
      "Digit2",
      "Digit3",
    ];
    ((s[r] = a.find((c) => o(c) && !t.has(c))), t.add(s[r]));
  }
  return s;
}

export { Jt as DEFAULT_KEYS, qa as normalizeKeys };
