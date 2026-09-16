import { useEffect, useRef, useState } from "react";
import { MASCOT_DISMISS_PROMPT, MASCOT_LINES } from "@/lib/mascot-lines";

interface CarnivalMascotEl extends HTMLElement {
  say(text: string, o?: { duration?: number }): void;
  dismiss(): void;
  show(): void;
  readonly dismissed: boolean;
  readonly currentSection: Element | null;
}

const SAY_MS = 20000;
const CYCLE_MS = 7000;

export function MascotDialogue() {
  const [confirming, setConfirming] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const mascotRef = useRef<CarnivalMascotEl | null>(null);
  const linesRef = useRef<[string, string] | null>(null);
  const altRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const keepRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const stopCycle = () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const sayLine = () => {
      const lines = linesRef.current;
      const mascot = mascotRef.current;
      if (!lines || !mascot || mascot.dismissed) return;
      mascot.say(lines[altRef.current ? 1 : 0], { duration: SAY_MS });
    };
    const startCycle = () => {
      stopCycle();
      if (!linesRef.current || !mascotRef.current || mascotRef.current.dismissed) return;
      timerRef.current = window.setInterval(() => {
        altRef.current = !altRef.current;
        sayLine();
      }, CYCLE_MS);
    };
    const speak = () => {
      altRef.current = false;
      sayLine();
      startCycle();
    };

    const onSectionChange = (event: Event) => {
      const section = (event as CustomEvent).detail?.section as HTMLElement | null;
      const key = section?.dataset?.["mascot"];
      const lines = key ? MASCOT_LINES[key] : undefined;
      if (!lines) {
        linesRef.current = null;
        stopCycle();
        return;
      }
      linesRef.current = lines;
      speak();
    };
    const onDismiss = () => {
      setDismissed(true);
      stopCycle();
    };
    const onShow = () => {
      setDismissed(false);
      speak();
    };
    const onDismissRequest = (event: Event) => {
      event.preventDefault();
      setConfirming(true);
    };

    void customElements.whenDefined("carnival-mascot").then(() => {
      if (cancelled) return;
      const mascot = document.querySelector("carnival-mascot") as CarnivalMascotEl | null;
      if (!mascot) return;
      mascotRef.current = mascot;
      setDismissed(mascot.dismissed);
      mascot.addEventListener("mascotsectionchange", onSectionChange);
      mascot.addEventListener("mascotdismiss", onDismiss);
      mascot.addEventListener("mascotshow", onShow);
      mascot.addEventListener("mascotdismissrequest", onDismissRequest);
      // Prime lines if a section was already detected before we attached.
      const current = mascot.currentSection as HTMLElement | null;
      const key = current?.dataset?.["mascot"];
      if (key && MASCOT_LINES[key]) {
        linesRef.current = MASCOT_LINES[key];
        speak();
      }
    });

    return () => {
      cancelled = true;
      stopCycle();
      const mascot = mascotRef.current;
      if (mascot) {
        mascot.removeEventListener("mascotsectionchange", onSectionChange);
        mascot.removeEventListener("mascotdismiss", onDismiss);
        mascot.removeEventListener("mascotshow", onShow);
        mascot.removeEventListener("mascotdismissrequest", onDismissRequest);
      }
    };
  }, []);

  useEffect(() => {
    if (!confirming) return;
    keepRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirming(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirming]);

  return (
    <>
      {confirming ? (
        <div
          className="mascot-confirm"
          role="dialog"
          aria-modal="false"
          aria-label="Dismiss the mascot"
        >
          <p>{MASCOT_DISMISS_PROMPT}</p>
          <div className="mascot-confirm-actions">
            <button
              ref={keepRef}
              type="button"
              className="btn btn-red"
              onClick={() => setConfirming(false)}
            >
              Keep dancing
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                mascotRef.current?.dismiss();
                setConfirming(false);
              }}
            >
              Dismiss her (for now)
            </button>
          </div>
        </div>
      ) : null}
      {dismissed ? (
        <button
          type="button"
          className="mascot-return"
          aria-label="Bring Dancing Olivia back"
          title="Bring Dancing Olivia back"
          onClick={() => mascotRef.current?.show()}
        >
          💃
        </button>
      ) : null}
    </>
  );
}
