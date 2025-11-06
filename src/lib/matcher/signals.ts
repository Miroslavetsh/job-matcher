import { IntakeData } from "@models/index";
import { tokenize } from "./normalize";

export interface IntakeSignals {
  tokens: string[];
  difficultAccess: boolean;
}

export function extractSignals(intake: IntakeData): IntakeSignals {
  const textFields: string[] = [
    intake.name,
    intake.address,
    intake.description,
  ];

  if (intake.company) {
    textFields.push(intake.company);
  }

  const combinedText = textFields.join(" ");
  const tokens = tokenize(combinedText);

  return {
    tokens,
    difficultAccess: intake.difficultAccess,
  };
}
