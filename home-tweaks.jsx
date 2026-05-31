/* Home page Tweaks: hero treatment + color/type direction.
   Applies to <html>/<body> live and mirrors color/accent/font to
   localStorage so sibling pages (Services, About, etc.) inherit them. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "cinematic",
  "color": "warm",
  "accent": "none",
  "font": "neue"
}/*EDITMODE-END*/;

const ACCENTS = [
  { id: "none",   col: "#111111" },
  { id: "clay",   col: "#9a5b3f" },
  { id: "forest", col: "#34463c" },
  { id: "slate",  col: "#3a4658" }
];

function HomeTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-color", t.color);
    root.setAttribute("data-accent", t.accent);
    root.setAttribute("data-font", t.font);
    document.body.setAttribute("data-hero", t.hero);
    try {
      localStorage.setItem("onoya-theme", JSON.stringify({ color: t.color, accent: t.accent, font: t.font }));
    } catch (e) {}
  }, [t.color, t.accent, t.font, t.hero]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero treatment" />
      <TweakRadio
        label="Layout"
        value={t.hero}
        options={[
          { value: "cinematic", label: "Cinematic" },
          { value: "split", label: "Split" },
          { value: "editorial", label: "Editorial" }
        ]}
        onChange={(v) => setTweak("hero", v)}
      />

      <TweakSection label="Color direction" />
      <TweakRadio
        label="Neutral"
        value={t.color}
        options={[
          { value: "warm", label: "Warm" },
          { value: "cool", label: "Cool" },
          { value: "pure", label: "Pure" }
        ]}
        onChange={(v) => setTweak("color", v)}
      />
      <TweakRow label="Accent">
        <div className="twk-chips" role="radiogroup">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              className="twk-chip"
              role="radio"
              aria-checked={t.accent === a.id}
              data-on={t.accent === a.id ? "1" : "0"}
              title={a.id}
              style={{ background: a.col }}
              onClick={() => setTweak("accent", a.id)}
            />
          ))}
        </div>
      </TweakRow>

      <TweakSection label="Typography" />
      <TweakRadio
        label="Typeface"
        value={t.font}
        options={[
          { value: "neue", label: "Neue" },
          { value: "grotesk", label: "Grotesk" },
          { value: "editorial", label: "Editorial" }
        ]}
        onChange={(v) => setTweak("font", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<HomeTweaks />);
