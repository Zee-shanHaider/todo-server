const express = require('express');
const multer = require('multer')
const path = require('path')
const helmet = require('helmet')
const app = express();
const compression = require('compression')
const cors = require('cors')

const fs = require('fs')

const session = require('express-session')

const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config({path: 'config.env'});

const MongoDBURI = process.env.MongoDBURI;



app.use(compression())

const folderDirectory='./files'
const fileStorage=multer.diskStorage({
    destination:function(req,file,cb){
      if(fs.existsSync(folderDirectory)){
        cb(null,folderDirectory)
      }else{
        try {
          fs.mkdirSync(folderDirectory)
          cb(null,folderDirectory)
        } catch (error) {
        cb(error,folderDirectory)
        }
      }
    },
    filename:function(req,file,cb){
      cb(null,`${Date.now()}--draftFile--${path.extname(file.originalname)}`)
    }
  })

  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
  app.use('/images', express.static(path.join(__dirname, 'files')));

app.use(express.json())

app.use((req,res,next)=>{
    res.setHeader('Access_Control_Allow_Origin', '*');
    res.setHeader('Access_Control_Allow_Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.setHeader('Access_Control_Allow_Headers', 'Content_Type, Authorization');
    next()
    
})
app.use(cors())

// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const mongoose = require('mongoose');

const port  = process.env.PORT || 8080;


const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/tasksRoutes')



app.use(authRoutes)
app.use(taskRoutes)



app.use((error,req,res,next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    console.log('message', message)
    const data = error.data;
    console.log('data', data)
    res.status(status).send({
        message: message,
        data: data
    })
})

    mongoose.connect(
        MongoDBURI
    )
    .then(res=>{
        app.listen(port,()=>{
            console.log('Database Connected Successfully!')
        })
    })
    .catch(err=>{
        console.log(err)
    })
