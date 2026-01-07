"use client";

import * as React from "react";

export function useCallTimer() {
  const [running, setRunning] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [running]);

  function start() { setRunning(true); }
  function stop() { setRunning(false); }
  function reset() { setRunning(false); setSeconds(0); }

  return { running, seconds, start, stop, reset };
}
