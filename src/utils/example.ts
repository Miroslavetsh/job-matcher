import { IntakeFormData } from "@lib/validation/schemas/intake";

const EXAMPLE_INTAKE: IntakeFormData = {
  name: "John Smith",
  phone: "+14155552671",
  email: "john.smith@example.com",
  address: "123 Main Street, New York, NY 10001",
  company: "Smith Construction LLC",
  description:
    "I need to install new windows in my house. The building is three stories high and requires scaffolding. I also need to replace the front door and repair some damaged window frames.",
  difficultAccess: true,
};

export async function loadExampleIntake(): Promise<IntakeFormData> {
  try {
    const response = await fetch("/assets/sample/intake.json");
    if (response.ok) {
      const data = await response.json();
      return data as IntakeFormData;
    }
  } catch (error) {
    console.warn("Failed to load example from JSON, using default:", error);
  }
  return EXAMPLE_INTAKE;
}

