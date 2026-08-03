import { Router } from "express";  
import {validateRequest} from "../middlewares/validate.middleware.js"
import {
    randomProblemValidator,
    listProblemsValidator,
    statusChangeValidator,
} from "../validators/cses.validator.js";
import {
    randomProblemGenerator,
    listOfProblems,
    problemStatusChange,
    Categories,
    statusesList,
    searchByTitleOrLink,
} from "../controllers/cses.controller.js"; 

const csesRoutes = Router();

csesRoutes.route("/random").post(randomProblemValidator(), validateRequest ,randomProblemGenerator);
csesRoutes
    .route("/list")
    .post(listProblemsValidator(), validateRequest, listOfProblems);
csesRoutes.route("/categories").get(Categories);
csesRoutes.route("/statuses").get(statusesList);
csesRoutes
    .route("/title-link")
    .get(searchByTitleOrLink);
csesRoutes
    .route("/status-change")
    .post(statusChangeValidator(), validateRequest, problemStatusChange);

export default csesRoutes;

