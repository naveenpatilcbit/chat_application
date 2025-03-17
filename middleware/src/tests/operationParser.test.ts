import { describe, expect, test } from "@jest/globals";
import OperationParser from "../utils/operationParser";

describe("OperationParser", () => {
  describe("parseOperationType", () => {
    test("should detect create operation", () => {
      const instructions = "Create a new action code named TEST";
      expect(OperationParser.parseOperationType(instructions)).toBe("create");
    });

    test("should detect update operation", () => {
      const instructions = "Update action code TEST";
      expect(OperationParser.parseOperationType(instructions)).toBe("update");
    });

    test("should detect delete operation", () => {
      const instructions = "Delete action code TEST";
      expect(OperationParser.parseOperationType(instructions)).toBe("delete");
    });

    test("should default to create operation", () => {
      const instructions = "Some random text";
      expect(OperationParser.parseOperationType(instructions)).toBe("create");
    });
  });

  describe("parseName", () => {
    test("should extract name with colon format", () => {
      const instructions = "Create action code name: TEST_CODE";
      expect(OperationParser.parseName(instructions)).toBe("TEST_CODE");
    });

    test("should extract name with space format", () => {
      const instructions = "Create action code name TEST_CODE";
      expect(OperationParser.parseName(instructions)).toBe("TEST_CODE");
    });

    test("should handle quoted names", () => {
      const instructions = 'Create action code name: "TEST CODE"';
      expect(OperationParser.parseName(instructions)).toBe("TEST CODE");
    });

    test("should return empty string for no match", () => {
      const instructions = "Create action code";
      expect(OperationParser.parseName(instructions)).toBe("");
    });
  });

  describe("parseUser", () => {
    test("should extract create user", () => {
      const instructions = "Create action code with create user: john.doe";
      expect(OperationParser.parseUser(instructions)).toBe("john.doe");
    });

    test("should extract update user", () => {
      const instructions = "Update action code with update user jane.doe";
      expect(OperationParser.parseUser(instructions)).toBe("jane.doe");
    });

    test("should default to system user", () => {
      const instructions = "Create action code TEST";
      expect(OperationParser.parseUser(instructions)).toBe("system");
    });
  });

  describe("parse", () => {
    test("should parse complete create instruction", () => {
      const instructions =
        "Create action code name: TEST_CODE with create user: john.doe";
      const result = OperationParser.parse(instructions);
      expect(result).toEqual({
        type: "create",
        name: "TEST_CODE",
        user: "john.doe",
      });
    });

    test("should parse complete update instruction", () => {
      const instructions =
        "Update action code name: TEST_CODE with update user: jane.doe";
      const result = OperationParser.parse(instructions);
      expect(result).toEqual({
        type: "update",
        name: "TEST_CODE",
        user: "jane.doe",
      });
    });

    test("should parse delete instruction", () => {
      const instructions = "Delete action code name: TEST_CODE";
      const result = OperationParser.parse(instructions);
      expect(result).toEqual({
        type: "delete",
        name: "TEST_CODE",
        user: "system",
      });
    });
  });
});
