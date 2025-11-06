"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Value } from "react-phone-number-input";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { PhoneInput } from "./ui/PhoneInput";
import { Textarea } from "./ui/Textarea";
import { Checkbox } from "./ui/Checkbox";
import {
  intakeSchema,
  type IntakeFormData,
} from "../lib/validation/schemas/intake";

type IntakeFormProps = {
  onSubmit: (data: IntakeFormData) => void | Promise<void>;
  onClear?: () => void;
  isLoading?: boolean;
};

export function IntakeForm({
  onSubmit,
  onClear,
  isLoading = false,
}: IntakeFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      difficultAccess: false,
      phone: "",
    },
  });

  const onFormSubmit = (data: IntakeFormData) => {
    onSubmit(data);
  };

  const handleClear = () => {
    reset();
    onClear?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4"
      noValidate
      aria-label="Client intake form"
    >
      <Input
        id="name"
        {...register("name")}
        type="text"
        label="Name"
        error={errors.name?.message}
        placeholder="Enter your name"
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            id="phone"
            label="Phone"
            value={(field.value as Value) || undefined}
            onChange={(value) => field.onChange(value || "")}
            error={errors.phone?.message}
            placeholder="Enter your phone number"
          />
        )}
      />

      <Input
        id="email"
        {...register("email")}
        type="email"
        label="Email"
        error={errors.email?.message}
        placeholder="Enter your email"
      />

      <Input
        id="address"
        {...register("address")}
        type="text"
        label="Address"
        error={errors.address?.message}
        placeholder="Enter your address"
      />

      <Input
        id="company"
        {...register("company")}
        type="text"
        label="Company (optional)"
        error={errors.company?.message}
        placeholder="Enter company name"
      />

      <Textarea
        id="description"
        {...register("description")}
        label="Description"
        error={errors.description?.message}
        placeholder="Describe your requirements (1-5 sentences)"
      />

      <Checkbox
        id="difficultAccess"
        {...register("difficultAccess")}
        label="Difficult access"
        error={errors.difficultAccess?.message}
      />

      <div className="flex gap-2" role="group" aria-label="Form actions">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          aria-label={isLoading ? "Processing match" : "Run matching"}
        >
          {isLoading ? "Processing..." : "Run Matching"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          disabled={isLoading}
          aria-label="Clear form"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
