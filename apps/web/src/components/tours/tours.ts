export type TourStep = {
  id: string;
  title: string;
  body: string;
  selector?: string; // optional highlight
};

export type Tour = {
  key: string;
  name: string;
  steps: TourStep[];
};

export const TOURS: Tour[] = [
  {
    key: "narrative",
    name: "Narrative Tour",
    steps: [
      { id: "t1", title: "This page shows what voters are hearing", body: "Watch Top Questions and Confusion Index each week." },
      { id: "t2", title: "Add a question in 10 seconds", body: "Use Quick Add → Voter Question. Literal words only." }
    ]
  },
  {
    key: "cm",
    name: "CM Board Tour",
    steps: [
      { id: "t1", title: "This is the operating board", body: "Stop-Doing + Cadence prevents drift. Decisions & Risks live here." },
      { id: "t2", title: "One rule", body: "If it’s not in the system, it’s not real." }
    ]
  }
];
