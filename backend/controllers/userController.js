const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get users without password field
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasMore: page < totalPages
            }
        });
    } catch (err) {
        console.error("Get users error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Get user without password
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's task statistics
        const taskStats = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format task statistics
        const stats = {
            totalTasks: 0,
            pending: 0,
            inProgress: 0,
            completed: 0
        };

        taskStats.forEach(stat => {
            stats.totalTasks += stat.count;
            if (stat._id === 'pending') stats.pending = stat.count;
            if (stat._id === 'in-progress') stats.inProgress = stat.count;
            if (stat._id === 'completed') stats.completed = stat.count;
        });

        res.status(200).json({
            user,
            taskStats: stats
        });
    } catch (err) {
        console.error("Get user by ID error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};





module.exports = { 
    getUsers, 
    getUserById,  // Fixed typo from gerUserbyId
  
   
};