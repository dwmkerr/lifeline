import { parse } from "csv-parse/sync";
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

function isEmptyRecord(record: Record<string, string>): boolean {
  const anyValue = Object.keys(record).find((key) => !!record[key]);
  return anyValue === undefined;
}

export async function importCsv(csv: string): Promise<ImportResults> {
  const warnings: ImportWarning[] = [];
  const emptyLineNumbers: number[] = [];
  const requireString = (
    record: Record<string, string>,
    colName: string,
    line: number,
  ) => {
    const val = record[colName];
    if (val === undefined) {
      warnings.push({
        title: "CSV Error",
        message: `Missing field ${colName} on line ${line + 1}`,
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
    //  Skip completely empty lines that are commonly exported at the end of the
    //  rows in excel.
    if (isEmptyRecord(record)) {
      emptyLineNumbers.push(line + 1);
      return undefined;
    }

    //  If we are missing the year, skip and warn.
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

  //  Filter out the undefined rows which we couldn't parse.
  const lifeEvents = results.filter(
    (record): record is ImportedLifeEvent => !!record,
  );

  //  If there were skipped lines, warn.
  if (emptyLineNumbers.length > 0) {
    warnings.push({
      title: "Skipped Empty Lines",
      message: `Skipped empty line(s): ${emptyLineNumbers.join(", ")}`,
    });
  }
  return {
    lifeEvents,
    warnings,
  };
}
