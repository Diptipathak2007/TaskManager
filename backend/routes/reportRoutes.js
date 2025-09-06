const express=require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const router=express.Router();
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");
router.get("/export/tasks",protect,adminOnly,exportTasksReport);
router.get("/export/users",protect,adminOnly,exportUsersReport);
module.exports=router;
