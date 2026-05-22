import successResponse from "../utils/successResponse.js";
import errorResponse from "../utils/errorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Problem} from "../models/cses.model.js"

const problemsList = asyncHandler(async (req, res, next) => {
    const problems = await Problem.find({ category: "Range Queries" });
    res.status(200).json(new successResponse(200, "Problem fetched successfully", problems));
})

const categoryList = asyncHandler(async (req, res, next) => {
    const categories = await Problem.aggregate([
        {
            $group: {
                _id: "$category",
            },
        },
        {
            $group: {
                _id: null,
                categories: { $push: "$_id" },
            },
        },
        {
            $project:{
                _id:0,
                categories: 1
            }
        }
    ]);
    res.send(categories)
})

export { problemsList, categoryList };