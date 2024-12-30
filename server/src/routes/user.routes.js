import { Router } from "express";
import { signup } from "../controllers/signup.controller.js";
import { signin } from "../controllers/sigin.controller.js";
import { homedata } from "../controllers/homedata.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
const router=Router();

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/home').post(verifyjwt,homedata)

export default router

