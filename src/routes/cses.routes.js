import { Router } from "express";  
import {
    randomProblemGenerator,
    listOfProblems,
    problemStatusChange,
    Categories,
    statusesList,
} from "../controllers/cses.controller.js"; 

const csesRoutes = Router();

csesRoutes.route("/random").post(randomProblemGenerator);
csesRoutes.route("/list").post(listOfProblems);
csesRoutes.route("/categories").get(Categories);
csesRoutes.route("/statuses").get(statusesList);
csesRoutes.route("/status-change").post(problemStatusChange);

export default csesRoutes;

