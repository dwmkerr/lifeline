import { importCsv } from "./LifelineCsv";

describe("LifelineCsv", () => {
  describe("import", () => {
    //  Skipping until we can polyfill Buffer
    test.skip("can import basic CSV file", async () => {
      const csv = `Year,Month,Day,Age,Category,Title,Notes,,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
      const lifeEvents = await importCsv(csv);
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
