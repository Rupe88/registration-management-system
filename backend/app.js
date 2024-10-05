const cookieParser = require("cookie-parser");
const express=require("express");
const connectionDB = require("./config/connection");
const authRoutes=require("./routes/authRoutes")
const cors=require("cors");
require("dotenv").config();
const app=express();
const port =process.env.PORT || 5000



app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//test
app.get("/", (req, res)=>{
return res.status(200).json({
success:true,
message:"hello world from palm mind"
})
});

app.use("/api/auth", authRoutes);


app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`)
    connectionDB();
})


