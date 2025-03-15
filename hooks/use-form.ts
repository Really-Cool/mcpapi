import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

type FormValues = Record<string, any>;
type FormErrors = Record<string, string>;
type ValidationRules = Record<string, (value: any, formValues: FormValues) => string | null>;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldTouched: (name: string, isTouched: boolean) => void;
  resetForm: () => void;
  validateField: (name: string) => string | null;
  validateForm: () => boolean;
}

/**
 * Custom hook for managing form state and validation
 * 
 * @param options - Configuration options for the form
 * @returns Object containing form state and methods
 */
export function useForm<T extends FormValues>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  // Form state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Validate a single field
  const validateField = useCallback(
    (name: string): string | null => {
      const validator = validationRules[name];
      if (!validator) return null;
      
      const errorMessage = validator(values[name], values);
      return errorMessage;
    },
    [validationRules, values]
  );
  
  // Validate all fields and update errors state
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validate each field with a validation rule
    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);
  
  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      const { name, value, type } = e.target;
      
      // Handle different input types
      let fieldValue: any = value;
      if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value);
      }
      
      setValues((prevValues) => ({
        ...prevValues,
        [name]: fieldValue,
      }));
      
      // Validate field if it's been touched
      if (touched[name]) {
        const error = validateField(name);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error || '',
        }));
      }
    },
    [touched, validateField]
  );
  
  // Handle input blur (mark field as touched)
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      const { name } = e.target;
      
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
      
      // Validate field
      const error = validateField(name);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error || '',
      }));
    },
    [validateField]
  );
  
  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      
      // Validate all fields
      const isValid = validateForm();
      
      if (isValid && onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [onSubmit, validateForm, values]
  );
  
  // Set a field value programmatically
  const setFieldValue = useCallback((name: string, value: any): void => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error || '',
      }));
    }
  }, [touched, validateField]);
  
  // Set a field's touched state programmatically
  const setFieldTouched = useCallback(
    (name: string, isTouched: boolean): void => {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: isTouched,
      }));
      
      // Validate field if it's being marked as touched
      if (isTouched) {
        const error = validateField(name);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error || '',
        }));
      }
    },
    [validateField]
  );
  
  // Reset form to initial values
  const resetForm = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Calculate if the form is valid
  const isValid = Object.keys(errors).length === 0;
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
  };
}
