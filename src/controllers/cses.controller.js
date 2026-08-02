import successResponse from "../utils/successResponse.js";
import errorResponse from "../utils/errorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Problem } from "../models/cses.model.js";
import {
    availableStatuses,
    listOfAvailableStatuses,
} from "../utils/constants.js";

const randomProblemGenerator = asyncHandler(async (req, res, next) => {
    const categories = req.body?.categories;

    if (!categories || categories.length === 0) {
        return next(new errorResponse(400, "Please select category", []));
    }

    const problems = await Problem.find({
        category: { $in: categories },
        status: "unsolved",
    }).lean();

    if (!problems) {
        return next(new errorResponse(400, "Please provide valid categories"));
    }

    const totalProblems = problems.length;

    if (totalProblems === 0) {
        return res
            .status(200)
            .json(
                new successResponse(
                    200,
                    "All problems have been solved !!",
                    {},
                ),
            );
    }

    const selectedProblemIndex = Math.floor(Math.random() * totalProblems);
    const selectedProblemDetails = problems[selectedProblemIndex];

    const selectedProblem = await Problem.findById(
        selectedProblemDetails._id,
    ).select("-_id -id -category");

    res.status(200).json(
        new successResponse(200, "Random Problem Generated", [selectedProblem]),
    );
});

const listOfProblems = asyncHandler(async (req, res, next) => {
    const categories = req.body?.categories;
    const statuses = req.body?.status;

    if (!categories.length || !statuses?.length) {
        return next(
            new errorResponse(400, "Please select category & status", []),
        );
    }

    if (
        !statuses.every((st) => {
            return listOfAvailableStatuses.includes(st);
        })
    ) {
        return next(new errorResponse(400, "Please provide valid status"));
    }

    const problems = await Problem.find({
        category: { $in: categories },
        status: { $in: statuses },
    })
        .sort({ id: 1 })
        .select("-_id -id")
        .lean();

    if (!problems || problems.length === 0) {
        return next(new errorResponse(400, "Please provide valid categories"));
    }

    res.status(200).json(
        new successResponse(
            200,
            "Successfully fetched all the problems",
            problems,
        ),
    );
});

const Categories = asyncHandler(async (req, res, next) => {
    const categories = await Problem.aggregate([
        {
            $group: {
                _id: "$category",
                first_id: {
                    $min: "$id",
                },
            },
        },
        {
            $sort: {
                first_id: 1,
            },
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
            },
        },
    ]);

    const categoryList = categories.map((c) => c.category);

    return res
        .status(200)
        .json(new successResponse(200, "All Categories Fetched", categoryList));
});

const statusesList = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(
            new successResponse(
                200,
                "Statuses Feched Successfully",
                listOfAvailableStatuses,
            ),
        );
});

const problemStatusChange = asyncHandler(async (req, res, next) => {
    const problemTitle = req.body.title;
    const changedStatus = req.body.status;

    if (!problemTitle) {
        return next(new errorResponse(400, "Please select problem title"));
    }

    if (!changedStatus || !listOfAvailableStatuses.includes(changedStatus)) {
        return next(new errorResponse(400, "Please provide valid status"));
    }

    const problem = await Problem.findOne({
        title: problemTitle,
    });

    if (!problem) {
        return next(
            new errorResponse(400, "Please select appropriate problem title"),
        );
    }

    problem.status = changedStatus;
    await problem.save({ validateBeforeSave: false });

    const updatedStatusProblem = await Problem.findById(problem._id).select(
        "-_id -id -category",
    );

    return res
        .status(201)
        .json(
            new successResponse(
                201,
                "Problem status has been changed!!",
                updatedStatusProblem,
            ),
        );
});

const searchByTitleOrLink = asyncHandler(async (req, res, next) => {
    
    const problemTitle = req.query.title;
    const problemUrl = req.query.url;
    // "/task\/(\d+)/"
    if (problemTitle) {
        const problemList = await Problem.find({
            title: { $regex: problemTitle, $options: "i" },
        }).select("-_id -id").lean();
        
        if (!problemList?.length) {
            return res
            .status(400)
            .json(new errorResponse(400, "Please Enter Valid Title"));
        }
        
        return res
        .status(200)
        .json(
            new successResponse(
                200,
                "Problems Fetched Successfully",
                problemList,
            ),
        );
    } else {
        const linkData = problemUrl.match(/task\/(\d+)/);
        if (!linkData?.length) {
            return res
                .status(400)
                .json(new errorResponse(400, "Please Enter Valid Title/Link", linkData));
        }

        const problemId = linkData[1];

        const problem = await Problem.findOne({
            url: { $regex: `task/${problemId}$` },
        })
            .select("-_id -id")
            .lean();

        if (!problem) {
            return res
                .status(400)
                .json(new errorResponse(400, "Please Enter Valid Link"));
        }

        return res
            .status(200)
            .json(
                new successResponse(
                    200,
                    "Problems Fetched Successfully",
                    problem,
                ),
            );
        
    }
});

export {
    randomProblemGenerator,
    listOfProblems,
    problemStatusChange,
    Categories,
    statusesList,
    searchByTitleOrLink,
};
