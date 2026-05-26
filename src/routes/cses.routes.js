import { Router } from "express";  
import {
    randomProblemGenerator,
    listOfProblems,
    problemStatusChange,
} from "../controllers/cses.controller.js"; 

const csesRoutes = Router();

csesRoutes.route("/random").post(randomProblemGenerator);
csesRoutes.route("/list").post(listOfProblems);
csesRoutes.route("/status-change").post(problemStatusChange);

export default csesRoutes;

