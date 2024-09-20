interface JoiErrorDetail {
  message: string;
  path: string[];
  type: string;
  context: {
    label: string;
    value: string;
    key: string;
  };
}

interface ValidationError {
  errors: JoiErrorDetail[];
}

interface FormattedError {
  message: string;
}

export const formatJoiErrors = (
  validationErrors: ValidationError
): Record<string, FormattedError> => {
  return validationErrors.errors.reduce((acc, err) => {
    const path = err.path.join(".");

    if (!acc[path]) {
      acc[path] = { message: err.message };
    }

    return acc;
  }, {} as Record<string, FormattedError>);
};
