// server/routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

router.get("/polls", apiController.getAllPolls);
router.post("/polls", apiController.createPoll);

module.exports = router;
