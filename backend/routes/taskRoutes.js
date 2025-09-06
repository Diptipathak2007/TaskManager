const express=require('express');
const {protect,adminOnly}=require('../middlewares/authMiddleware');
const { get } = require('mongoose');
const router=express.Router();
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getDashboardData, getUserDashboardData } = require('../controllers/taskController');

//Task manaagement route
router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/",protect,getAllTasks);
router.get("/:id",protect,getTaskById);
router.post("/",protect,adminOnly,createTask);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,adminOnly,deleteTask);
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,adminOnly,updateTaskChecklist);

module.exports=router;
