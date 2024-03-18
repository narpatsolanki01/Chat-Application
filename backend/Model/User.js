import mongoose from "mongoose";

const User =new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        uniqe: true,
    },
    password:{
        type:String,
        require:true,
    }
})
const userModel=mongoose.model("User",User);
export default userModel;