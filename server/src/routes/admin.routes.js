const { Router } = require("express");
const { addprogram, deletprogram, graph, uploadtimetable } = require("../controllers/admin.controller");

const router=Router();

router.route("/addprogram").post(addprogram)
router.route("/deleteprogram").post(deletprogram)
router.route("/graphdata").post(graph);
router.route("/uploadtimetable").post(uploadtimetable);

module.exports = router;