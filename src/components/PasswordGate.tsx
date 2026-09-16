import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HASH = import.meta.env["VITE_SITE_PASSCODE_HASH"] as string | undefined;

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("site-unlocked") === HASH) setUnlocked(true);
  }, []);

  if (!HASH || unlocked) return children;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setChecking(true);
    setError(false);
    try {
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value),
      );
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      if (hex === HASH.toLowerCase()) {
        sessionStorage.setItem("site-unlocked", hex);
        setUnlocked(true);
      } else {
        setError(true);
        setValue("");
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm"
      >
        <h1 className="text-center text-xl font-semibold text-foreground">
          This preview is password protected
        </h1>
        <div className="mt-6">
          <label
            htmlFor="passcode"
            className="text-sm font-medium text-foreground"
          >
            Passcode
          </label>
          <Input
            id="passcode"
            type="password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="current-password"
            className="mt-2"
            required
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            Incorrect passcode
          </p>
        )}
        <Button type="submit" className="mt-4 w-full" disabled={checking}>
          {checking ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </div>
  );
}
