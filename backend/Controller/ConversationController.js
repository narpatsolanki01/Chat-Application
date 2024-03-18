import ConversationModel from "../Model/Conversation.js";
import userModel from "../Model/User.js";
class ConversationConroller{
    static createConversation=async(req,res)=>{
        const {senderId,receiverId}=req.body;
        try{
            const conversation=await ConversationModel({members:[senderId,receiverId]});
            if(conversation){
                await conversation.save();
                res.status(201).json(conversation);
            }
        }
        catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }
    static findUserConversation=async(req,res)=>{
        try{
            const userId=req.params.userId;
            const conversations=await ConversationModel.find({members:{$in:[userId]}});
            const conversationsData=Promise.all(conversations.map(async(con)=>{
                const reciverId=con.members.find((member)=>member!=userId);
                const user=await userModel.findById(reciverId);
                return {user:{reciverId:user._id,email:user.email,name:user.name}, conversationId:con._id}
            }))
            res.status(200).json(await conversationsData);
        }
        catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }
}
export default ConversationConroller;