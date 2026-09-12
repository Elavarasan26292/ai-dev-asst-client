import i18n from "../i18n/i18n";

export interface ValidationRule {
  validate: (value: string) => boolean;
  getMessage: () => string;
}

export const required = (fieldName: string): ValidationRule => ({
  validate: (value) => value.trim().length > 0,
  getMessage: () => i18n.t("validation.required", { field: fieldName }),
});

export const validEmail: ValidationRule = {
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  getMessage: () => i18n.t("validation.invalidEmail"),
};

export const minLength = (
  length: number,
  fieldName: string
): ValidationRule => ({
  validate: (value) => value.length >= length,
  getMessage: () =>
    i18n.t("validation.minLength", { field: fieldName, length }),
});

export function validateField(
  value: string,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.getMessage();
    }
  }
  return null;
}
