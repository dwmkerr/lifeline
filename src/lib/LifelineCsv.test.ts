import { checkCsvContents, importCsv } from "./LifelineCsv";

describe("LifelineCsv", () => {
  describe("import", () => {
    describe("checkCsvContents", () => {
      test("can check a CSV file for columns and rows", async () => {
        const csv = `Year,Month,Day,Age,Category,Title,Notes,,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
        const { columns, rowCount } = await checkCsvContents(csv);
        expect(columns).toEqual([
          "Year",
          "Month",
          "Day",
          "Age",
          "Category",
          "Title",
          "Notes",
        ]);
        expect(rowCount).toEqual(2);
      });
    });

    describe("importCsv", () => {
      const defaultOptions = {
        columnMappings: {
          title: "Title",
          category: "Category",
          year: "Year",
          month: "Month",
          day: "Day",
          notes: "Notes",
        },
      };

      test("can import basic CSV file", async () => {
        const csv = `Year,Month,Day,Age,Category,Title,Notes,,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
        const { warnings, lifeEvents } = await importCsv(csv, defaultOptions);
        expect(warnings).toMatchObject([]);
        expect(lifeEvents).toMatchObject([
          {
            year: 1985,
            month: 1,
            title: "Belfast",
            notes: "",
          },
          {
            year: 1987,
            month: 2,
            title: "Colchester",
            notes: "",
          },
        ]);
      });
      test("can ignore empty CSV lines", async () => {
        const csv = `Year,Month,Day,Age,Category,Title,Notes,,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
        const { warnings, lifeEvents } = await importCsv(csv, defaultOptions);
        expect(warnings).toMatchObject([
          {
            title: "Skipped Empty Lines",
            message: "Skipped empty line(s): 2, 3",
          },
        ]);
        expect(lifeEvents).toMatchObject([
          {
            year: 1985,
            month: 1,
            title: "Belfast",
            notes: "",
          },
          {
            year: 1987,
            month: 2,
            title: "Colchester",
            notes: "",
          },
        ]);
      });
    });
  });
});
