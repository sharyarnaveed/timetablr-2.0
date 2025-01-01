const { Router } = require("express");
const { addprogram, deletprogram, graph } = require("../controllers/admin.controller");

const router=Router();

router.route("/addprogram").post(addprogram)
router.route("/deleteprogram").post(deletprogram)
router.route("/graphdata").post(graph);
module.exports = router;