export function getFullscreenContainer(): HTMLElement {
  return (document.fullscreenElement as HTMLElement | null) ?? document.body;
}
