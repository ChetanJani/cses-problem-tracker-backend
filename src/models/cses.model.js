import mongoose,{ Schema } from "mongoose";
import { listOfAvailableStatuses } from "../utils/constants.js";

const csesSchema = new Schema(
    {
        id: Number,
        title: String,
        category: String,
        url: String,
        status: {
            type: String,
            enum:{
                values: listOfAvailableStatuses,
                message: "{VALUE} is not a valid status"
            }
        },
        topic: String,
    },
    {
        collection: "cses",
    },
);

export const Problem = mongoose.model("Problem", csesSchema);