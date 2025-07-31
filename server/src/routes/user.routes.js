
const { Router } = require("express");
const { signup, getprogram } = require("../controllers/signup.controller.js");
const { logout, signin } = require("../controllers/sigin.controller.js");
const { homedata, getalltimetable, blank, getcoursesfromdb, addCourse } = require("../controllers/homedata.controller.js");
const { verifyjwt } = require("../middleware/auth.middleware.js");
const { changepassword, changeusername } = require("../controllers/settings.controller.js");
const { viewcourse, deletecourse } = require("../controllers/courses.controller.js");
const { getidTimetable } = require("../controllers/getidtimetablr.controller.js");
const { getCoursesformake, addMakeupClass, viewMakeupclasses, deletemakeclass } = require("../controllers/makeclass.controller.js");
const { storetokens, sendnotification, classNotification } = require("../controllers/sendNotification.controller.js");


const router=Router();

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/home').post(verifyjwt,homedata)
router.route('/logout').post(verifyjwt,logout)


router.route('/changepassword').put(verifyjwt,changepassword)
router.route('/changeusername').put(verifyjwt,changeusername)


router.route('/getprogramfromdb').get(getprogram)
router.route('/alltimetable').get(verifyjwt,getalltimetable)
router.route('/loadall').post(verifyjwt,blank)


router.route('/getcoursesfromdb/:id').get(verifyjwt,getcoursesfromdb)
router.route('/addcourse').post(verifyjwt,addCourse)
router.route('/viewcourses').get(verifyjwt,viewcourse)
router.route('/deletecourse/:id').delete(verifyjwt,deletecourse)


router.route('/gettimetable').post(verifyjwt,getidTimetable)
router.route('/getmakeupcourses').get(verifyjwt,getCoursesformake)
router.route('/addmakeupclass').post(verifyjwt,addMakeupClass)
router.route('/viewmakeupclass').get(verifyjwt,viewMakeupclasses)
router.route('/deletemakeclass').post(verifyjwt,deletemakeclass)
router.route("/storetoken").post(verifyjwt,storetokens)
router.route("/sendnotification").get(sendnotification)
router.route("/classnotification").get(classNotification)



module.exports = router;


