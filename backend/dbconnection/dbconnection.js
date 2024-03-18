import mongoose from "mongoose";
const  connection =async(conn)=>{
    try{
        await mongoose.connect(conn);
        console.log("Connection Successfull")
    }
    catch(err){
        console.log("Not Connected to MongoDb Error!",err);
    }

}
export default connection;