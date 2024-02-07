import { Buffer } from "buffer";
(window as any)["global"] = window;
global.Buffer = global.Buffer || Buffer;
import { parse } from "csv-parse/sync";
import { LifeEvent } from "./LifeEvent";
import { LifelineError } from "./Errors";

type ImportedLifeEvent = Omit<LifeEvent, "id" | "userId">;

export async function importCsv(csv: string): Promise<ImportedLifeEvent[]> {
  const requireString = (
    record: Record<string, string>,
    colName: string,
    line: number,
  ) => {
    const val = record[colName];
    if (val === undefined) {
      throw new LifelineError(
        "CSV Error",
        `Missing field ${colName} on line ${line}`,
      );
    }
    return val;
  };
  const records = parse(csv, {
    columns: true,
  }) as Record<string, string>[];
  const events = records.map((record, line) => {
    // Work with each record
    console.log(record);
    const year = Number.parseInt(requireString(record, "Year", line));
    const month = record?.Month;
    const day = record?.Day;
    const category = record?.Category;
    const title = record?.Title;
    const notes = record?.Notes;

    return {
      date: new Date(),
      year,
      month: month ? Number.parseInt(month) : null,
      day: day ? Number.parseInt(day) : null,
      category,
      title,
      notes,
    };
  });
  return events;
}
