const mongoose=require("mongoose");
require("dotenv").config();

const connectionDB=async()=>{
    await mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("database is connected successfully!")
    }).catch((error)=>{
        console.log("error in database connection", error)
    })
};

module.exports=connectionDB;
