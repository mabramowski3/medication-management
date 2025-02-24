import { expect, test, vi } from "vitest";
import { updateActiveStatus } from "..";


test("should return the same status as the one passed as an argument", async () => {
  const expected = true;
  const mockDbClient = {
    send: (args) =>  Promise.resolve({Attributes: {active: true}})
  }
  const result = await updateActiveStatus(mockDbClient as any, "Advil", true);
  console.log(result);
  expect(result).toEqual(expected);
});
