import { useEffect, useState } from "react";
import { z } from "zod";

interface Error {
  message: string;
  field: string;
}

export const useFormValidator = <T>({ data, schema }: { data: T; schema: z.ZodType<Record<string, unknown>> }) => {
  const [validationErrors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    const validate = async () => {
      try {
        await schema.parseAsync(data);
        setErrors([]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(
            error.issues.map((issue) => ({
              message: issue.message,
              field: String(issue.path[0]),
            })),
          );
        } else {
          console.error("Unexpected validation error:", error);
        }
      }
    };

    validate();
  }, [data, schema]);

  return { validationErrors };
};
