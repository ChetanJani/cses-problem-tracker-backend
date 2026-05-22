import mongoose,{ Schema } from "mongoose";

const csesSchema = new Schema(
    {
        id: Number,
        title: String,
        category: String,
        url: String,
        status: String,
        topic: String,
    },
    {
        collection: "cses",
    },
);

export const Problem = mongoose.model("Problem", csesSchema);