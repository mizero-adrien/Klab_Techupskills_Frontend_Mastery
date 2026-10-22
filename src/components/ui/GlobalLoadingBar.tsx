import { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const SHOW_DELAY_MS = 250;

function GlobalLoadingBar() {
  const busy = useIsFetching() + useIsMutating() > 0;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!busy) {
      // Hide on the next tick instead of during the effect body, so the bar
      // disappears without a cascading render.
      const timer = setTimeout(() => setVisible(false), 0);
      return () => clearTimeout(timer);
    }

    // Requests that finish quickly never show the bar, so it doesn't flicker
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [busy]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-\[60] h-1 overflow-hidden bg-brand/20"
    >
      <div className="h-full w-1/3 animate-[loading-bar_1s_ease-in-out_infinite] bg-brand" />
    </div>
  )
}

export default GlobalLoadingBar;