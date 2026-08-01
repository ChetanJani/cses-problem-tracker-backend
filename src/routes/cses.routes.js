import { Router } from "express";  
import {
    randomProblemGenerator,
    listOfProblems,
    problemStatusChange,
    Categories,
} from "../controllers/cses.controller.js"; 

const csesRoutes = Router();

csesRoutes.route("/random").post(randomProblemGenerator);
csesRoutes.route("/list").post(listOfProblems);
csesRoutes.route("/categories").get(Categories);
csesRoutes.route("/status-change").post(problemStatusChange);

export default csesRoutes;

