const Task = require('../models/Task');
const User = require('../models/User');

// @desc Get dashboard data for admin
// @route GET /api/tasks/dashboard-data
// @access Private/Admin
const getDashboardData = async (req, res) => {
    try {
        // Total tasks count
        const totalTasks = await Task.countDocuments();
        
        // Tasks by status
        const tasksByStatus = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Tasks by priority
        const tasksByPriority = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent tasks (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentTasks = await Task.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Overdue tasks
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });

        // Task completion rate
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

        // Top performers (users with most completed tasks)
        const topPerformers = await Task.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$assignedTo',
                    completedCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    name: '$user.name',
                    email: '$user.email',
                    completedCount: 1
                }
            },
            { $sort: { completedCount: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            totalTasks,
            tasksByStatus,
            tasksByPriority,
            recentTasks,
            overdueTasks,
            completionRate: parseFloat(completionRate),
            topPerformers
        });
    } catch (err) {
        console.error("Get dashboard data error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Get user dashboard data
// @route GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // User's tasks count
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        
        // User's tasks by status
        const tasksByStatus = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // User's overdue tasks
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });

        // User's upcoming tasks (due in next 7 days)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const upcomingTasks = await Task.countDocuments({
            assignedTo: userId,
            dueDate: { $gte: new Date(), $lte: sevenDaysFromNow },
            status: { $ne: 'completed' }
        });

        // Recent activities (last 5 tasks)
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title status priority dueDate updatedAt');

        res.status(200).json({
            totalTasks,
            tasksByStatus,
            overdueTasks,
            upcomingTasks,
            recentTasks
        });
    } catch (err) {
        console.error("Get user dashboard data error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Get all tasks
// @route GET /api/tasks
// @access Private
const getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Filter options
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.priority) filter.priority = req.query.priority;
        if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

        // If user is not admin, only show their tasks
        if (req.user.role !== 'admin') {
            filter.assignedTo = req.user._id;
        }

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalTasks = await Task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalTasks,
                hasMore: page < totalPages
            }
        });
    } catch (err) {
        console.error("Get all tasks error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Get task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email profileImageUrl')
            .populate('createdBy', 'name email profileImageUrl');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user can view this task
        if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error("Get task by ID error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Create new task
// @route POST /api/tasks
// @access Private/Admin
// @desc Create new task
// @route POST /api/tasks
// @access Private/Admin
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate, todoChecklist } = req.body;

        // Validation
        if (!title || !assignedTo) {
            return res.status(400).json({ message: 'Title and assignedTo are required' });
        }

        // Check if assigned user exists
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ message: 'Assigned user not found' });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            assignedTo,
            createdBy: req.user._id,
            priority: priority || 'medium',
            dueDate,
            todoChecklist: Array.isArray(todoChecklist) ? todoChecklist : [],
            status: 'pending'
        });

        // Populate the created task
        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email profileImageUrl')
            .populate('createdBy', 'name email profileImageUrl');

        res.status(201).json({
            message: 'Task created successfully',
            task: populatedTask
        });

    } catch (err) {
        console.error("Create task error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check permissions
        const canUpdate = req.user.role === 'admin' || 
                         task.assignedTo.toString() === req.user._id.toString() ||
                         task.createdBy.toString() === req.user._id.toString();

        if (!canUpdate) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const { title, description, priority, dueDate, status } = req.body;

        // Update fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email profileImageUrl')
            .populate('createdBy', 'name email profileImageUrl');

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (err) {
        console.error("Update task error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private/Admin
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error("Delete task error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Update task status
// @route PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Valid status is required (pending, in-progress, completed)' });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check permissions
        const canUpdate = req.user.role === 'admin' || 
                         task.assignedTo.toString() === req.user._id.toString();

        if (!canUpdate) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        if (status === 'completed') {
            task.completedAt = new Date();
        }

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email profileImageUrl')
            .populate('createdBy', 'name email profileImageUrl');

        res.status(200).json({
            message: 'Task status updated successfully',
            task: updatedTask
        });
    } catch (err) {
        console.error("Update task status error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Update task checklist
// @route PUT /api/tasks/:id/todo
// @access Private/Admin
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body;

        if (!Array.isArray(todoChecklist)) {
            return res.status(400).json({ message: 'todoChecklist must be an array' });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.todoChecklist = todoChecklist; // ✅ Match schema field
        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email profileImageUrl')
            .populate('createdBy', 'name email profileImageUrl');

        res.status(200).json({
            message: 'Task checklist updated successfully',
            task: updatedTask
        });
    } catch (err) {
        console.error("Update task checklist error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


module.exports = {
    getDashboardData,
    getUserDashboardData,
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist
};