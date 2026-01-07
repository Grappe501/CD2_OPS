/**
 * Discord slash commands for CD2_OPS intake.
 * Register using scripts/discord/register-commands.mjs
 */
export const commands = [
  {
    name: "stopdoing",
    description: "Add a Stop-Doing item (modal)"
  },
  {
    name: "cadence",
    description: "Add a cadence commitment (modal)"
  },
  {
    name: "question",
    description: "Capture a voter question (modal)"
  },
  {
    name: "confusion",
    description: "Log a confusion signal (modal)"
  },
  {
    name: "message",
    description: "Update message discipline status (modal)"
  }
];
