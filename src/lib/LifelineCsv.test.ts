import { importCsv } from "./LifelineCsv";

describe("LifelineCsv", () => {
  describe("import", () => {
    test("can import basic CSV file", () => {
      const csv = `Year,Month,Day,Age,Category,Title,Notes (italic = mum's notes),,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,,
`;
      const lifeEvents = importCsv(csv);
      expect(lifeEvents).toEqual([
        {
          year: 1985,
          month: 1,
          title: "Belfast",
        },
        {
          year: 1987,
          month: 2,
          title: "Colchester",
        },
      ]);
    });
  });
});
