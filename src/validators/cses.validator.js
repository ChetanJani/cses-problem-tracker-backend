import { body, query } from "express-validator";
import {listOfAvailableStatuses } from "../utils/constants.js";

const randomProblemValidator = () => {
    return [
        body("categories")
            .isArray({ min: 1 })
            .withMessage("categories should not be empty"),
        body("categories.*")
            .isString()
            .withMessage("Each category must be a string")
            .trim()
            .notEmpty()
            .withMessage("category cannot be empty"),
    ];
};

const listProblemsValidator = () => {
    return [
        body("categories")
            .isArray({ min: 1 })
            .withMessage("categories should not be empty"),
        body("categories.*")
            .isString()
            .withMessage("Each category must be a string")
            .trim()
            .notEmpty()
            .withMessage("category cannot be empty"),
        body("status")
            .isArray({ min: 1 })
            .withMessage("statuses should not be empty"),
        body("status.*")
            .isString()
            .withMessage("Each status must be a string")
            .trim()
            .notEmpty()
            .withMessage("status cannot be empty")
            .isIn(listOfAvailableStatuses)
            .withMessage("statuses are invalid"),
    ];
};

const statusChangeValidator = () => {
    return [
        body("id")
            .notEmpty()
            .withMessage("id cannot be blank or empty")
            .isInt()
            .withMessage("id must be a whole number")
            .toInt(),
        body("status")
            .notEmpty()
            .withMessage("status cannot be blank or empty")
            .trim()
            .isString()
            .withMessage("status must be a string ")
            .isIn(listOfAvailableStatuses)
            .withMessage("status is invalid"),
    ];
};

export { randomProblemValidator, listProblemsValidator, statusChangeValidator };
