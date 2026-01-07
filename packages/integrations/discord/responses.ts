/**
 * Discord Interaction Response Types:
 * 4 = CHANNEL_MESSAGE_WITH_SOURCE
 * 9 = MODAL
 */
export function pongResponse() {
  return { type: 1 };
}

function modal(name: string, title: string, custom_id: string, components: any[]) {
  return { type: 9, data: { title, custom_id, components } };
}

function textInput(custom_id: string, label: string, placeholder: string, required = true, style: 2) {
  // style 1 = short, 2 = paragraph
  return {
    type: 1,
    components: [
      {
        type: 4,
        custom_id,
        label,
        style,
        min_length: required ? 1 : 0,
        required,
        placeholder
      }
    ]
  };
}

export function openModalResponse(commandName: string) {
  switch (commandName) {
    case "stopdoing":
      return modal("stopdoing", "Add Stop-Doing", "cd2_stopdoing", [
        textInput("title", "Title", "No random events without ROI", true, 1),
        textInput("reason", "Reason (optional)", "What this protects", false, 2)
      ]);
    case "cadence":
      return modal("cadence", "Add Cadence Commitment", "cd2_cadence", [
        textInput("window", "Window", "week | two_week | six_week | ninety_day", true, 1),
        textInput("title", "Title", "Publish weekly scorecard by Monday 8am", true, 1),
        textInput("due_at", "Due (ISO or 'YYYY-MM-DDTHH:MM')", "2026-01-10T09:00", true, 1),
        textInput("notes", "Notes (optional)", "What done means", false, 2)
      ]);
    case "question":
      return modal("question", "Capture Voter Question", "cd2_question", [
        textInput("question", "Question", "Are you going to protect Social Security?", true, 2),
        textInput("tag", "Tag (optional)", "retirement, jobs, schools", false, 1),
        textInput("county", "County (optional)", "Pulaski", false, 1)
      ]);
    case "confusion":
      return modal("confusion", "Log Confusion Signal", "cd2_confusion", [
        textInput("level", "Level", "none | some | widespread", true, 1),
        textInput("theme", "Theme (optional)", "Medicare cuts rumor", false, 1),
        textInput("county", "County (optional)", "Pulaski", false, 1),
        textInput("notes", "Notes (optional)", "What people are hearing", false, 2)
      ]);
    case "message":
      return modal("message", "Update Message Discipline", "cd2_message", [
        textInput("status", "Status", "holding | slipping | broken", true, 1),
        textInput("notes", "Notes (optional)", "What is slipping + what to change", false, 2)
      ]);
    default:
      return { type: 4, data: { content: "Unknown command." } };
  }
}
