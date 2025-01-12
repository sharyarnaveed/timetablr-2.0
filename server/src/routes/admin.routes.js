const { Router } = require("express");
const { addprogram, deletprogram, graph, uploadtimetable, adminsigin, logout } = require("../controllers/admin.controller");
const { adminverifyjwt } = require("../middleware/adminauth.middleware");
const { gettimetable, deletetimetable, getuserinfo } = require("../controllers/admintimetable.controller");

const router=Router();

router.route("/addprogram").post(adminverifyjwt,addprogram)
router.route("/deleteprogram").post(adminverifyjwt,deletprogram)
router.route("/graphdata").post(adminverifyjwt,graph);
router.route("/uploadtimetable").post(adminverifyjwt,uploadtimetable);
router.route("/adminlogin").post(adminsigin)
router.route("/adminlogut").post(adminverifyjwt,logout)
router.route("/timetabledata").post(adminverifyjwt,gettimetable)
router.route("/deletetimetabledata").post(adminverifyjwt,deletetimetable)
router.route("/getuserinfo").post(adminverifyjwt,getuserinfo)

module.exports = router;