const express = require("express");
const app= express();
const dotenv =require("dotenv");
const mongoose =require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer  = require ("multer");


dotenv.config();




const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongoDB.")
      } catch (error) {
        throw error;
      }
    };
    
    mongoose.connection.on("disconnected", ()=>{
        console.log("mongoDb disconnected")
    })

    const storage = multer.diskStorage({
      destination:(req,file,cb) =>{
        cb(null,"images");
      },
      filename:(req,file,cb)=>{
        cb(null, "helo.jpeg");
      },
    });


    const upload = multer({storage:storage});
    app.post("/api/upload", upload.single("file"),(req,res)=>{
      res.status(200).json("file has been uploaded successfully!");
    });

   

    //middlewares
    app.use(express.json());
    app.use("/api/auth",authRoute);
    app.use("/api/user",userRoute);
    app.use("/api/posts",postRoute);
    app.use("/api/categories",categoryRoute);

   
    
    app.use((err,req,res, next)=>{
        const errorStatus =err.status || 500;
        const errorMessage =err.message || "something went wrong!";
        return res.status(errorStatus).json({
          success: false,
          status:errorStatus,
          message:errorMessage,
          stack: err.stack
        });
      });
  
  
  app.listen(5000, ()=>{
      connect()
      console.log("Connected to backend server!");
  });;