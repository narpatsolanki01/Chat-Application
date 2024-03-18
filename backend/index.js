import  express  from "express";
import cors from "cors";
// import { createServer } from 'node:http';
import {createServer} from "http";
import connect from "./dbconnection/dbconnection.js";
// import web from "./Routes/Web.js"
import User from "./Routes/User.js";
import {Server} from "socket.io";
import conversation from "./Routes/Conversation.js";
import Messages from "./Routes/Messages.js";
const port =process.env.PORT || 5000 
const database ="mongodb://0.0.0.0:27017/Wathsappclone";
const App = express();
const server=createServer();
const io= new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
        credentials:true,
    } ,
})
let users=[];
io.on('connection',(socket)=>{
    console.log("New Connection");
    socket.on("addUser",(userId)=>{
        const userExit = users.find(user=>user.userId===userId);
        if(!userExit){
            users.push({userId,socketId:socket.id});
            io.emit("getUsers",users);
        }
    })
    socket.on("sendMessage",async({senderId,receiverId,text,conversationId})=>{
        const receiver = users.find(user=>user.userId===receiverId);
        const sender = users.find(user=>user.userId===senderId);
        if(receiver){
            io.to(receiver.socketId).to(sender.socketId).emit("getMessage",{
                senderId,
                text,
                conversationId,
                receiverId
            })
        }
    })    
    socket.on("dissconnect",()=>{
        users=users.filter(user=>user.socketId!==socket.id);
        io.emit("getUsers",users);
    })
    
})
App.use(cors());
connect(database);
App.use(express.json());
App.use(express.urlencoded({extended:false}));
App.use("/api/user",User);
App.use("/api/conversation",conversation);
App.use("/api/Messages",Messages);
App.listen(port,()=>{
    console.log(`Example app Listening at http://localhost:${port}`);
})
server.listen(3001);