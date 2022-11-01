const Task = require('../model/tasks');
const User = require('../model/user')
exports.postTask=async (req, res, next)=>{

    const title = req.body.title;
    const date = req.body.date;
    console.log('date', date)
    const status = req.body.status;
    try{
        const task = new Task({
            title: title,
            status: status,
            todoDate: date,
            creator: req.userId
        })
        const response =await task.save()
        if(response){
            const user =await User.findById(req.userId);
            user.tasks.push(task)
            const creator =await user.save()
            if(creator){
                res.status(201).json({
                    message: 'Task created Successfully!',
                    task: response
            })
        }   
    }
   
}
catch(err){
    res.status(400).json({message: 'Task can not created!'})
 }
}
    

    
exports.getTasks =async (req,res,next)=>{
    const tasks =await Task.find({creator : req.userId});
    if(!tasks){
        return res.status(204).json({message: 'There is no task to do.'})
    }
    return res.status(200).json({tasks: tasks})
}

exports.deleteTask =async (req,res,next)=>{
        const taskId = req.params.taskId;
        try{
            const task = await Task.findById(taskId);
            if(task.creator.toString() !== req.userId){
                const error = new Error('Not Authorizd!')
                error.statusCode = 403;
                next(error);
            }
            const response =await Task.findByIdAndDelete(taskId);
            if(response){
                const user = await User.findById(req.userId);
                user.tasks.pull(taskId);
                const updatedUserTasks=await user.save()
                if(updatedUserTasks)
               return res.status(200).json({message: "Successfully Deleted!", response: response});
            }
        }
        catch(error){
            res.status(500).json({message: "Deleting Product Failed!", error: error});
        }
    
}

exports.editTask =async (req,res,next)=>{
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if(task.creator.toString() !== req.userId){
        const error = new Error('Not Authorizd!')
        error.statusCode = 403;
        next(error);
    }
    try{

        if(!req.body){
            res.status(400).send({
                message:"Data to Update can not be empty"
            })
        }
        
        const response =await Task.findByIdAndUpdate(taskId, req.body)
        console.log(response)
            if(!response){
                return res.status(400).send({
                    message: `Can not update Task with ${taskId}. May be user can not find`,
                })
            }
            res.status(200).send(response);
    }
    catch(err){
        res.status(500).send({
            message: "Error Update User Infomation"
        });
    }
    
}

exports.deleteAllTasks =async (req,res,next)=>{
    try{
        const response = await Task.deleteMany({creator: req.userId});
        res.status(200).send({message: 'Tasks deleted Successfully'})
    }
    catch(error){
        res.status(401).send({message: 'Tasks can not deleted'})
    }
}

exports.deleteDoneTasks =async (req,res,next)=>{
    try{
        const response =await Task.deleteMany({status: 'done'})
        res.status(200).send({message: 'Tasks deleted Successfully', response: response})
    }
    catch{error}{
        res.status(401).send({message: 'Tasks can not be deleted', error: error})
    }
}