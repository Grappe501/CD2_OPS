export type HelpTopic = {
  key: string;
  title: string;
  body: string[];
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    key: "quick_add",
    title: "How to add something (fast)",
    body: [
      "Click the + Quick Add button (bottom right).",
      "Pick what you’re adding (Question, Confusion, Cadence, Stop-Doing).",
      "Type one sentence. Hit Save.",
      "That’s it — leadership sees it in the dashboards and weekly rhythm."
    ]
  },
  {
    key: "discord",
    title: "How to submit from the AJAX Organizing Hub",
    body: [
      "Type /question to log a voter question.",
      "Type /confusion to log a confusion signal.",
      "Type /cadence to lock a commitment.",
      "If your name shows as Unknown in audit, an admin links your Discord ID once."
    ]
  },
  {
    key: "what_next",
    title: "What happens after I submit?",
    body: [
      "Questions become Top Questions and shape messaging.",
      "Confusion signals raise the Confusion Index so comms can correct fast.",
      "Cadence commitments create due dates and reduce surprises.",
      "Stop-Doing protects focus and prevents drift."
    ]
  }
];

export function helpForRoute(pathname: string): HelpTopic[] {
  // basic routing: expand later
  if (pathname.includes("/dashboard/narrative")) return HELP_TOPICS;
  if (pathname.includes("/dashboard/cm")) return HELP_TOPICS;
  if (pathname.includes("/dashboard/cadence")) return HELP_TOPICS;
  return HELP_TOPICS;
}
