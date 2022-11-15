const express = require('express');

const isAuth = require('../middlewares/isAuth')

const router = express.Router();

const taskController = require('../controllers/taskController')

router.post('/api/task',isAuth,taskController.postTask)

router.get('/api/tasks',isAuth, taskController.getTasks)

router.delete('/api/deleteTask/:taskId',isAuth, taskController.deleteTask)

router.delete('/api/deleteAllTasks',isAuth, taskController.deleteAllTasks)

router.put('/api/updateTask/:taskId', isAuth, taskController.editTask);

router.delete('/api/deleteDoneTasks',isAuth ,taskController.deleteDoneTasks)

router.get('/api/doneTasks',isAuth, taskController.getDoneTasks)

router.get('/api/pendingTasks', isAuth,taskController.getTodoTasks)

router.get('/api/getTodayTasks',isAuth, taskController.getTodayTasks)

module.exports = router;