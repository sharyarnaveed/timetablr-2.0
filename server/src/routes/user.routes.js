
const { Router } = require("express");
const { signup, getprogram } = require("../controllers/signup.controller.js");
const { logout, signin } = require("../controllers/sigin.controller.js");
const { homedata, getalltimetable, blank } = require("../controllers/homedata.controller.js");
const { verifyjwt } = require("../middleware/auth.middleware.js");
const { changepassword, changeusername } = require("../controllers/settings.controller.js");



const router=Router();

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/home').post(verifyjwt,homedata)
router.route('/logout').post(verifyjwt,logout)
router.route('/changepassword').post(verifyjwt,changepassword)
router.route('/changeusername').post(verifyjwt,changeusername)
router.route('/getprogramfromdb').post(getprogram)
router.route('/alltimetable').post(verifyjwt,getalltimetable)
router.route('/loadall').post(verifyjwt,blank)


module.exports = router;


