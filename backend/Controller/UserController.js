import userModel from "../Model/User.js";
import ConversationModel from "../Model/Conversation.js";
import  jwt  from "jsonwebtoken";
class UserController{
    static getUsers=(req,res)=>{
        res.send("Hello World")
    }
    static createUser= async(req,res)=>{
        let check=await userModel.findOne({email:req.body.email});

        try{
            if(check){
                  return res.status(400).json({success:false,massege:"Email Already Exist"});  
            }
            else{
                const User=new userModel({
                    name:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                });
                const newUser=await User.save();
                const token=jwt.sign({email:User.email,id:User._id},"NOTESAPI");
                res.status(201).json({success:true,token:token,detail:{name:req.body.username,email:req.body.email,Id:User._id}});
                // res.status(201).json({success:true});
            }
        }
        
        catch(err){
            res.status(400).json({success:false,massege:err.message})
        }
    }
    static signUser = async(req,res)=>{
        const {email,password}=req.body;
        try{
            const user=await userModel.findOne({email:email});
            if(!user){
                return res.status(404).json({success:false,massege:"User Not Found"});
            }
           
            if(!password===user.password){
                return res.status(400).json({success:false,massege:"Invalid Credential"});
            }
            const token=jwt.sign({email:user.email,id:user._id},"NOTESAPI");
            res.status(200).json({success:true,token:token,detail:{name:user.name,email:user.email,Id:user._id}});
        }
        catch(err){
            res.status(500).json({success:false,massege:err.message})
        }
    }
    
    static getUser=async(req,res)=>{
        try{
            const user1=await req.params.id;
            const users=await userModel.find({_id:{$ne:user1}});
                const userData=Promise.all(users.map( async(user)=>{
                    const conv = await ConversationModel.find({members:{$all:[user1,user._id]}});
                    if(conv){
                        return {user:{reciverId:user._id,email:user.email,name:user.name}}
                    }
                    else{
                        return {};
                    }
                }))
                res.status(201).json(await userData);
        }
        catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }
}
export default UserController;