import type { WidgetDef } from "../types";

import { candidateCockpitWidgets } from "./candidate_cockpit";
import { cmOperatingBoardWidgets } from "./cm_operating_board";
import { financeCommandWidgets } from "./finance_command";
import { callTimeWidgets } from "./call_time";
import { fieldCommandWidgets } from "./field_command";
import { narrativeTrustWidgets } from "./narrative_trust";
import { decisionsWidgets } from "./decisions";
import { risksWidgets } from "./risks";
import { cadenceWidgets } from "./cadence";
import { dataEntryWidgets } from "./data_entry";
import { systemHealthWidgets } from "./system_health";
import { adminConsoleWidgets } from "./admin_console";

export const WIDGETS: WidgetDef[] = [
  ...candidateCockpitWidgets,
  ...cmOperatingBoardWidgets,
  ...financeCommandWidgets,
  ...callTimeWidgets,
  ...fieldCommandWidgets,
  ...narrativeTrustWidgets,
  ...decisionsWidgets,
  ...risksWidgets,
  ...cadenceWidgets,
  ...dataEntryWidgets,
  ...systemHealthWidgets,
  ...adminConsoleWidgets,
];
