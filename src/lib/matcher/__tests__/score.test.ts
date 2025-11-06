import { describe, it, expect } from "vitest";
import {
  calculateKeywordScore,
  calculateFuzzyScore,
  calculateCategoryBoost,
} from "../score";
import { match } from "../index";
import { Position } from "@models/position";
import { IntakeData } from "@models/intake";
import { Catalogue } from "@models/catalogue";

describe("Scoring Functions", () => {
  describe("calculateKeywordScore", () => {
    it("should return 1.0 for perfect token match", () => {
      const position: Position = {
        position_number: 100,
        short_name_en: "Install windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows in building",
        description_de: "",
        hero: false,
      };

      const tokens = ["install", "window"];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBeGreaterThan(0.5);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it("should return 0.0 for no token match", () => {
      const position: Position = {
        position_number: 200,
        short_name_en: "Paint walls",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Paint interior walls",
        description_de: "",
        hero: false,
      };

      const tokens = ["install", "window", "door"];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBe(0);
    });

    it("should return partial score for partial match", () => {
      const position: Position = {
        position_number: 300,
        short_name_en: "Install windows and doors",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows and doors in building",
        description_de: "",
        hero: false,
      };

      const tokens = ["install", "window"];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1.0);
    });

    it("should handle empty tokens array", () => {
      const position: Position = {
        position_number: 400,
        short_name_en: "Install windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows",
        description_de: "",
        hero: false,
      };

      const tokens: string[] = [];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBe(0);
    });
  });

  describe("calculateFuzzyScore", () => {
    it("should return high score for similar text", () => {
      const position: Position = {
        position_number: 500,
        short_name_en: "Install roof windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install roof windows in building",
        description_de: "",
        hero: false,
      };

      const intakeText = "I need to install windows in the roof";
      const score = calculateFuzzyScore(intakeText, position);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it("should return low score for dissimilar text", () => {
      const position: Position = {
        position_number: 600,
        short_name_en: "Paint walls",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Paint interior walls",
        description_de: "",
        hero: false,
      };

      const intakeText = "I need to install windows";
      const score = calculateFuzzyScore(intakeText, position);

      expect(score).toBeLessThan(0.5);
    });

    it("should handle empty intake text", () => {
      const position: Position = {
        position_number: 700,
        short_name_en: "Install windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows",
        description_de: "",
        hero: false,
      };

      const intakeText = "";
      const score = calculateFuzzyScore(intakeText, position);

      expect(score).toBe(0);
    });
  });

  describe("calculateCategoryBoost", () => {
    it("should return 0.2 when difficultAccess is true", () => {
      const boost = calculateCategoryBoost(true);
      expect(boost).toBe(0.2);
    });

    it("should return 0 when difficultAccess is false", () => {
      const boost = calculateCategoryBoost(false);
      expect(boost).toBe(0);
    });
  });

  describe("match function - integration", () => {
    const createTestCatalogue = (): Catalogue => ({
      trades: [
        {
          code: "0100",
          name_de: "Test Trade",
          name_en: "Test Trade",
          positions: [
            {
              position_number: 100,
              short_name_en: "Install windows",
              short_name_de: "",
              unit: "Stk.",
              description_en: "Install windows in building",
              description_de: "",
              hero: false,
            },
            {
              position_number: 200,
              short_name_en: "Paint walls",
              short_name_de: "",
              unit: "Stk.",
              description_en: "Paint interior walls",
              description_de: "",
              hero: false,
            },
            {
              position_number: 300,
              short_name_en: "Use equipment for difficult access",
              short_name_de: "",
              unit: "Stk.",
              description_en: "Using stair climbers, cranes, or hoists",
              description_de: "",
              hero: false,
            },
          ],
        },
      ],
    });

    it("should return top results sorted by score", () => {
      const catalogue = createTestCatalogue();
      const intake: IntakeData = {
        name: "John Doe",
        phone: "+1234567890",
        email: "john@example.com",
        address: "123 Main St",
        description: "I need to install windows in my house",
        difficultAccess: false,
      };

      const results = match(intake, catalogue, 15);

      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(15);

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it("should apply category boost when difficultAccess is true", () => {
      const catalogue = createTestCatalogue();
      const intake: IntakeData = {
        name: "Jane Doe",
        phone: "+1234567890",
        email: "jane@example.com",
        address: "456 Oak Ave",
        description: "I need help with difficult access",
        difficultAccess: true,
      };

      const results = match(intake, catalogue, 15);

      const difficultAccessPosition = results.find(
        (r) => r.position.position_number === 300
      );

      expect(difficultAccessPosition).toBeDefined();
      if (difficultAccessPosition) {
        expect(difficultAccessPosition.why.categoryBoost).toBe(true);
      }
    });

    it("should deduplicate by position_number", () => {
      const catalogue: Catalogue = {
        trades: [
          {
            code: "0100",
            name_de: "Test",
            name_en: "Test",
            positions: [
              {
                position_number: 100,
                short_name_en: "Install windows",
                short_name_de: "",
                unit: "Stk.",
                description_en: "Install windows",
                description_de: "",
                hero: false,
              },
            ],
          },
          {
            code: "0200",
            name_de: "Test 2",
            name_en: "Test 2",
            positions: [
              {
                position_number: 100,
                short_name_en: "Install windows duplicate",
                short_name_de: "",
                unit: "Stk.",
                description_en: "Install windows duplicate",
                description_de: "",
                hero: false,
              },
            ],
          },
        ],
      };

      const intake: IntakeData = {
        name: "Test",
        phone: "+1234567890",
        email: "test@example.com",
        address: "Test",
        description: "install windows",
        difficultAccess: false,
      };

      const results = match(intake, catalogue, 15);

      const positionNumbers = results.map((r) => r.position.position_number);
      const uniqueNumbers = new Set(positionNumbers);

      expect(positionNumbers.length).toBe(uniqueNumbers.size);
    });

    it("should handle empty description", () => {
      const catalogue = createTestCatalogue();
      const intake: IntakeData = {
        name: "Test",
        phone: "+1234567890",
        email: "test@example.com",
        address: "Test",
        description: "",
        difficultAccess: false,
      };

      const results = match(intake, catalogue, 15);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
