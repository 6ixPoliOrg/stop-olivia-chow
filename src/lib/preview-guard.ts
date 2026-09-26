export function isPreviewConfigured(hash: string | undefined): boolean {
  return typeof hash === "string" && /^[a-f0-9]{64}$/i.test(hash);
}
