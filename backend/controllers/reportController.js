const ExcelJS = require("exceljs");
const Task = require("../models/Task");
const User = require("../models/User");

// @desc    Export all tasks as an Excel file
// @route   GET /api/reports/export/tasks
// @access  Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    // Fetch all tasks with populated assignedTo field
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found to export"
      });
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    // Define worksheet columns with proper formatting
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "Assigned Email", key: "assignedEmail", width: 35 },
      { header: "Created By", key: "createdBy", width: 25 },
      { header: "Created Date", key: "createdAt", width: 20 },
      { header: "Updated Date", key: "updatedAt", width: 20 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add task data to worksheet
    tasks.forEach((task, index) => {
      const assignedToName = task.assignedTo 
        ? (Array.isArray(task.assignedTo) 
            ? task.assignedTo.map(user => user.name).join(', ')
            : task.assignedTo.name)
        : 'Unassigned';
      
      const assignedToEmail = task.assignedTo 
        ? (Array.isArray(task.assignedTo) 
            ? task.assignedTo.map(user => user.email).join(', ')
            : task.assignedTo.email)
        : '';

      const createdByName = task.createdBy ? task.createdBy.name : 'System';

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description || 'No description',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : 'No due date',
        assignedTo: assignedToName,
        assignedEmail: assignedToEmail,
        createdBy: createdByName,
        createdAt: task.createdAt.toISOString().split('T')[0],
        updatedAt: task.updatedAt.toISOString().split('T')[0]
      });

      // Add alternating row colors
      const currentRow = worksheet.getRow(index + 2);
      if (index % 2 === 0) {
        currentRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }
          };
        });
      }

      // Add borders to all cells
      currentRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Add summary information
    worksheet.addRow({});
    const summaryRow = worksheet.addRow({
      _id: 'SUMMARY:',
      title: `Total Tasks: ${tasks.length}`,
      description: `Generated on: ${new Date().toLocaleDateString()}`,
      priority: `Completed: ${tasks.filter(t => t.status === 'completed').length}`,
      status: `In Progress: ${tasks.filter(t => t.status === 'in-progress').length}`,
      dueDate: `Pending: ${tasks.filter(t => t.status === 'pending').length}`
    });

    // Style summary row
    summaryRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEB9C' }
      };
    });

    // Set response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=tasks_report_${new Date().toISOString().split('T')[0]}.xlsx`
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting tasks report:', error);
    res.status(500).json({
      success: false,
      message: "Error exporting tasks report",
      error: error.message
    });
  }
};

// @desc    Export all users as an Excel file
// @route   GET /api/reports/export/users
// @access  Private (Admin)
const exportUsersReport = async (req, res) => {
  try {
    // Fetch all users (excluding password)
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found to export"
      });
    }

    // Get task statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const totalTasks = await Task.countDocuments({ assignedTo: user._id });
        const completedTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'completed' 
        });
        const pendingTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'pending' 
        });
        const inProgressTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'in-progress' 
        });

        return {
          ...user.toObject(),
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks
        };
      })
    );

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    // Define worksheet columns
    worksheet.columns = [
      { header: "User ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 35 },
      { header: "Role", key: "role", width: 15 },
      { header: "Status", key: "isActive", width: 15 },
      { header: "Total Tasks", key: "totalTasks", width: 15 },
      { header: "Completed", key: "completedTasks", width: 15 },
      { header: "In Progress", key: "inProgressTasks", width: 15 },
      { header: "Pending", key: "pendingTasks", width: 15 },
      { header: "Last Login", key: "lastLogin", width: 20 },
      { header: "Join Date", key: "createdAt", width: 20 },
      { header: "Profile Image", key: "profileImage", width: 30 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '70AD47' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add user data to worksheet
    usersWithStats.forEach((user, index) => {
      worksheet.addRow({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive ? 'Active' : 'Inactive',
        totalTasks: user.totalTasks,
        completedTasks: user.completedTasks,
        inProgressTasks: user.inProgressTasks,
        pendingTasks: user.pendingTasks,
        lastLogin: user.lastLogin ? user.lastLogin.toISOString().split('T')[0] : 'Never',
        createdAt: user.createdAt.toISOString().split('T')[0],
        profileImage: user.profileImage || 'No image'
      });

      // Add alternating row colors
      const currentRow = worksheet.getRow(index + 2);
      if (index % 2 === 0) {
        currentRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }
          };
        });
      }

      // Add borders to all cells
      currentRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Add summary information
    worksheet.addRow({});
    const summaryRow = worksheet.addRow({
      _id: 'SUMMARY:',
      name: `Total Users: ${users.length}`,
      email: `Active Users: ${users.filter(u => u.isActive).length}`,
      role: `Admins: ${users.filter(u => u.role === 'admin').length}`,
      isActive: `Users: ${users.filter(u => u.role === 'user').length}`,
      totalTasks: `Generated: ${new Date().toLocaleDateString()}`
    });

    // Style summary row
    summaryRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEB9C' }
      };
    });

    // Set response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=users_report_${new Date().toISOString().split('T')[0]}.xlsx`
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting users report:', error);
    res.status(500).json({
      success: false,
      message: "Error exporting users report",
      error: error.message
    });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport
};