import { parse } from "csv-parse/browser/esm/sync";
import { LifeEvent } from "./LifeEvent";

type ImportedLifeEvent = Omit<LifeEvent, "id" | "userId">;

type ImportWarning = {
  title: string;
  message: string;
  line?: number;
};

type ImportResults = {
  lifeEvents: ImportedLifeEvent[];
  warnings: ImportWarning[];
};

export async function importCsv(csv: string): Promise<ImportResults> {
  const warnings: ImportWarning[] = [];
  const requireString = (
    record: Record<string, string>,
    colName: string,
    line: number,
  ) => {
    const val = record[colName];
    if (val === undefined) {
      warnings.push({
        title: "CSV Error",
        message: `Missing field ${colName} on line ${line}`,
        line,
      });
      return undefined;
    }
    return val;
  };
  const records = parse(csv, {
    columns: true,
  }) as Record<string, string>[];
  const results = records.map((record, line): ImportedLifeEvent | undefined => {
    // Work with each record
    console.log(record);
    const yearStr = requireString(record, "Year", line);
    if (yearStr === undefined) {
      return undefined;
    }
    const year = Number.parseInt(yearStr);
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

  const lifeEvents = results.filter(
    (record): record is ImportedLifeEvent => !!record,
  );
  return {
    lifeEvents,
    warnings,
  };
}
