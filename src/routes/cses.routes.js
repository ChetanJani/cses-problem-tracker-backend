import { Router } from "express";  
import { problemsList, categoryList } from "../controllers/cses.controller.js"; 

const csesRoutes = Router();

csesRoutes.route("/list").post(categoryList);

export default csesRoutes;

