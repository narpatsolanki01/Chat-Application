import mongoose from "mongoose";
const MessagesSchema =new mongoose.Schema({
    conversationId:{
        type:String,
    },
    senderId:{
        type:String,
    },
    text:{
        type:String,
    }
})
const MessagesModel=mongoose.model("messagess",MessagesSchema)
export default MessagesModel;