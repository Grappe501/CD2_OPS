"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Ask = { amount: number; label?: string | null };
type Objection = { label: string; response_text: string; note_insert: string };

export function FrScriptPanel(props: {
  laneKey?: string | null;
  displayName?: string | null;
  phone?: string | null;
  askSuggested?: number | null;
  script?: {
    title: string;
    opening: string;
    why_this_race?: string | null;
    credibility_bullets?: string | null;
    ask_line: string;
    close_line?: string | null;
  } | null;
  askLadder?: Ask[];
  onInsertText: (t: string) => void;
  objections?: Objection[];
  onInsertObjectionNote: (t: string) => void;
}) {
  const { script, displayName, askSuggested, askLadder, onInsertText, objections, onInsertObjectionNote } = props;

  function interpolate(s: string) {
    const name = displayName || "there";
    const ask = askSuggested ? `$${Number(askSuggested).toLocaleString()}` : "{ASK}";
    return s.replaceAll("{NAME}", name).replaceAll("{ASK}", ask);
  }

  return (
    <div className="rounded-xl border p-4 card-elder space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm opacity-70">Script</div>
        <div className="text-sm font-semibold">{script?.title || "No script loaded"}</div>
      </div>

      <div className="space-y-2 text-sm">
        <p><b>Opening:</b> {script ? interpolate(script.opening) : "—"}</p>
        {script?.why_this_race ? <p><b>Why:</b> {script.why_this_race}</p> : null}
        {script?.credibility_bullets ? <p><b>Credibility:</b> {script.credibility_bullets}</p> : null}
        <p><b>Ask:</b> {script ? interpolate(script.ask_line) : "—"}</p>
        {script?.close_line ? <p><b>Close:</b> {script.close_line}</p> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {script ? (
          <>
            <Button className="btn-elder" variant="secondary" onClick={() => onInsertText(interpolate(script.opening))}>
              Insert opening
            </Button>
            <Button className="btn-elder" variant="secondary" onClick={() => onInsertText(interpolate(script.ask_line))}>
              Insert ask
            </Button>
            {script.close_line ? (
              <Button className="btn-elder" variant="secondary" onClick={() => onInsertText(script.close_line!)}>
                Insert close
              </Button>
            ) : null}
          </>
        ) : null}
      </div>

      {askLadder?.length ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Ask ladder</div>
          <div className="flex flex-wrap gap-2">
            {askLadder.map((a, idx) => (
              <Button
                key={idx}
                className="btn-elder"
                variant="secondary"
                onClick={() => onInsertText(`Ask: $${Number(a.amount).toLocaleString()} (${a.label || "ask"})`)}
              >
                ${Number(a.amount).toLocaleString()} {a.label ? `— ${a.label}` : ""}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {objections?.length ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Objections</div>
          <div className="flex flex-wrap gap-2">
            {objections.slice(0, 8).map((o, idx) => (
              <Button
                key={idx}
                className="btn-elder"
                variant="secondary"
                onClick={() => onInsertObjectionNote(o.note_insert)}
                title={o.response_text}
              >
                {o.label}
              </Button>
            ))}
          </div>
          <div className="text-xs opacity-70">Tip: tap an objection to insert a short note in the call log.</div>
        </div>
      ) : null}
    </div>
  );
}
