import { CategoryColorCodes, CategoryColor } from "./CategoryColor";

describe("CategoryColor", () => {
  describe("getColor", () => {
    test("can create a set of colors based on the sorted unique set of categories", async () => {
      const categories = ["Life", "Work", "Social", "Travel"];
      const colors = CategoryColor.getColors(categories);
      //  Note that the results are sorted and unique.
      expect(colors).toEqual({
        Life: CategoryColorCodes[0],
        Social: CategoryColorCodes[1],
        Travel: CategoryColorCodes[2],
        Work: CategoryColorCodes[3],
      });
    });

    test("can roll-over the color codes if there are too many categories", async () => {
      const tooManyColors = [...CategoryColorCodes, ...CategoryColorCodes];
      const tooManyCategories = tooManyColors.map(
        (color, index) => `Category ${index + 1} - ${color}`,
      );
      const firstColor = CategoryColor.getColor(
        tooManyCategories,
        tooManyCategories[0],
      );
      const firstRolledOverColor = CategoryColor.getColor(
        tooManyCategories,
        tooManyCategories[CategoryColorCodes.length + 1],
      );

      expect(firstColor).toEqual(CategoryColorCodes[0]);
      expect(firstRolledOverColor).toEqual(CategoryColorCodes[1]);
    });
  });
});
