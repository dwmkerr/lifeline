import { parse } from "csv-parse";
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
  const parser = parse(csv, {
    columns: true,
  });
  const records: ImportedLifeEvent[] = [];
  let line = 0;
  for await (const record of parser) {
    // Work with each record
    console.log(record);
    const year = Number.parseInt(requireString(record, "Year", line));
    const month = record?.Month;
    const day = record?.Day;
    const category = record?.Category;
    const title = record?.Title;
    const notes = record?.Notes;

    records.push({
      date: new Date(),
      year,
      month: month ? Number.parseInt(month) : null,
      day: day ? Number.parseInt(day) : null,
      category,
      title,
      notes,
    });
    line = line + 1;
  }
  return records;
}
