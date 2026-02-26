import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error.issues) {
            return res.status(400).json({
                error: 'Validation Error',
                details: error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        next(error);
        next(error);
    }
};
