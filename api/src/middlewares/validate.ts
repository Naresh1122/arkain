import Ajv from "ajv";

const ajv = new Ajv();

export function validate(schema: any) {
  const validateFn = ajv.compile(schema);

  return (req: any, res: any, next: any) => {
    if (!validateFn(req.body)) {
      return res.status(400).json({
        status: "validation_error",
        errors: validateFn.errors
      });
    }
    next();
  };
}
