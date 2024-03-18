import MessagesModel from "../Model/Messages.js";
import userModel from "../Model/User.js";
import ConversationModel from "../Model/Conversation.js";
class MessagesController{
    static createMessage=async(req,res)=>{
        const {conversationId,senderId,text,receiverid=""}=req.body;
        
        try{
            if(conversationId==='new' && receiverid){
                const newConversation=await ConversationModel({members:[senderId,receiverid]});
                await newConversation.save();
                const message=await MessagesModel({conversationId:newConversation._id,senderId,text});
                await message.save();
                res.status(201).json("Message Sent Successfully");
            }
            else if(!conversationId && !receiverid){
                res.status(400).json({message:"conversationId or receiverId is required"});
            }
            const message=await MessagesModel({conversationId,senderId,text});
            if(message){
                await message.save();
                res.status(201).json(message);
            }
        }
        catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }
    static findConversationMessages=async(req,res)=>{
        try{
            
            const checkMessage=async(conversationId)=>{
                const messages=await MessagesModel.find({conversationId});
                const messageData=Promise.all(messages.map(async(message)=>{
                    const user=await userModel.findById(message.senderId);
                    return {user:{id:user._id,email:user.email,name:user.name},message:message.text}
                }));    
                res.status(200).json(await messageData);
            }
            const conversationId=req.params.conversationId;
            if(conversationId==='new'){
                const  conversation=await ConversationModel.find({members:{$all:[req.query.senderId,req.query.receiverid]}});
                if(conversation.length>0){
                    checkMessage(conversation[0]._id);
                }
                else{

                    res.status(200).json([]);
                }
            }
            else{
                checkMessage(conversationId);  
            }
        }
        catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }
}
export default MessagesController;