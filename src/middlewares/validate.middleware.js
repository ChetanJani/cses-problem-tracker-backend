import { validationResult } from "express-validator";
import errorResponse from "../utils/errorResponse.js";

const validateRequest = (req, res, next) => {
    const errros = validationResult(req);

    if (!errros.isEmpty()) {
        const errorArray = errros.array().map((error) => {
            return { [error.path]: error.msg };
        });
        return res
            .status(400)
            .json(new errorResponse(400, "Incorrect Request Body", errorArray));
    }

    next();
};

export { validateRequest };
