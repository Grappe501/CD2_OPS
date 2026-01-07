import { formatISODateTime } from "@/lib/format";

export type ColumnDef<Row> = {
  key: string;
  header: string;
  render?: (row: Row) => React.ReactNode;
  className?: string;
};

export function DataTable<Row extends Record<string, any>>(props: {
  columns: ColumnDef<Row>[];
  rows: Row[];
  rowKey?: (row: Row, idx: number) => string;
}) {
  const rowKey = props.rowKey ?? ((_, idx) => String(idx));

  return (
    <div className="overflow-auto rounded-xl border border-white/10 bg-black/20">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            {props.columns.map((c) => (
              <th key={c.key} className={`text-left px-4 py-3 font-semibold text-white/80 ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((r, idx) => (
            <tr key={rowKey(r, idx)} className="border-t border-white/10 hover:bg-white/5">
              {props.columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 text-white/75 ${c.className ?? ""}`}>
                  {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
