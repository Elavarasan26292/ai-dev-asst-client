import { useState, useCallback } from "react";
import { type ValidationRule, validateField } from "../utils/validators";

interface FieldConfig {
  initialValue?: string;
  rules: ValidationRule[];
}

interface FormState {
  values: Record<string, string>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
}

export function useForm(fields: Record<string, FieldConfig>) {
  const [state, setState] = useState<FormState>(() => {
    const values: Record<string, string> = {};
    const errors: Record<string, string | null> = {};
    const touched: Record<string, boolean> = {};

    Object.keys(fields).forEach((key) => {
      values[key] = fields[key].initialValue || "";
      errors[key] = null;
      touched[key] = false;
    });

    return { values, errors, touched };
  });

  const setValue = useCallback(
    (field: string, value: string) => {
      setState((prev) => {
        const error = prev.touched[field]
          ? validateField(value, fields[field].rules)
          : null;

        return {
          ...prev,
          values: { ...prev.values, [field]: value },
          errors: { ...prev.errors, [field]: error },
        };
      });
    },
    [fields]
  );

  const setTouched = useCallback(
    (field: string) => {
      setState((prev) => {
        const error = validateField(prev.values[field], fields[field].rules);
        return {
          ...prev,
          touched: { ...prev.touched, [field]: true },
          errors: { ...prev.errors, [field]: error },
        };
      });
    },
    [fields]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string | null> = {};
    const newTouched: Record<string, boolean> = {};
    let isValid = true;

    Object.keys(fields).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(state.values[key], fields[key].rules);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setState((prev) => ({
      ...prev,
      errors: newErrors,
      touched: newTouched,
    }));

    return isValid;
  }, [fields, state.values]);

  const resetForm = useCallback(() => {
    const values: Record<string, string> = {};
    const errors: Record<string, string | null> = {};
    const touched: Record<string, boolean> = {};

    Object.keys(fields).forEach((key) => {
      values[key] = fields[key].initialValue || "";
      errors[key] = null;
      touched[key] = false;
    });

    setState({ values, errors, touched });
  }, [fields]);

  const isFormValid = Object.keys(fields).every(
    (key) => validateField(state.values[key], fields[key].rules) === null
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isFormValid,
    setValue,
    setTouched,
    validateAll,
    resetForm,
  };
}
