import express from "express";
import errorResponse from "./utils/errorResponse.js";
import successResponse from "./utils/successResponse.js";
import csesRoutes from "./routes/cses.routes.js";

const app = express();

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
    if (!(err instanceof errorResponse)) {
        err.message = err.message || "Internal Server Error";
    }
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json(err);
});

export default app;
