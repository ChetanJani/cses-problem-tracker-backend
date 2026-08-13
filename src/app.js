import "./env.js";
import express from "express";
import errorResponse from "./utils/errorResponse.js";
import successResponse from "./utils/successResponse.js";
import csesRoutes from "./routes/cses.routes.js";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: process.env.CSES_CLIENT_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.route("/healthcheck").get((req, res, next) => {
    res.status(200).json(
        new successResponse(200, "Application Running Fine !!"),
    );
});
app.use("/cses", csesRoutes);

app.use((err, req, res, next) => {
    let error = err;
    if (!(err instanceof errorResponse)) {
        error = new errorResponse(
            err.statusCode || 500,
            err.message || "Internal Server Error",
            err.errors || [],
        );
    }
    error.statusCode = err.statusCode || 500;
    res.status(error.statusCode).json(error);
});

export default app;
