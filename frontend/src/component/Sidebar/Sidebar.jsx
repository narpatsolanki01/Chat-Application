import React, { useEffect, useState } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import  {io}  from "socket.io-client";

import "./Sidebar.css";
const Sidebar=()=>{
        const [user,setUser]=useState(JSON.parse(sessionStorage.getItem('detail')));
        const [converesation,setconveresation] =useState([]);
        const [Sid,setSid]=useState(JSON.parse(sessionStorage.getItem('detail')));
        const [message,setmessage]=useState({});
        const [sendMessages,setsendMessage]=useState('');

        //new people 
        console.log("Message=>",message);
        const [people,setpople]=useState([]);
        //socket io
        const [socket,setsocket]=useState(null);
        useEffect(()=>{
            setsocket(io("http://localhost:5000"));
        },[])
           
       useEffect(()=>{
            socket?.emit('addUser',Sid?.Id);
            socket?.on('getUsers',(users)=>{
                console.log("Active Users=>",users);
            })
            socket?.on('getMessage',(data)=>{
                setmessage((prev)=>({
                    ...prev,
                    messages:[...prev.messages,{user,message:data.text}]
                }));
            });
        },[socket]);
      
    // conversations
    useEffect(()=>{
        let responseData;
        const feathconversation= async()=>{
            try{
                const loginUser=JSON.parse(sessionStorage.getItem('detail'))
                await fetch(`http://localhost:5000/api/conversation/${loginUser.Id}`,{
                    method:"GET",
                    headers:{
                        'Content-Type':'application/Json',
                    },
                }).then((res)=>res.json()).then((data)=>responseData=data); 
                setconveresation(responseData);  
            }
            catch(error){
                console.log(error);
            }
           
        }
        feathconversation();
    },[]);
    //All peoples 
    useEffect(()=>{
        const AllUsers=async()=>{
            let responseData;
            try{
                await fetch(`http://localhost:5000/api/user/${Sid.Id}`,{
                    method:"GET",
                    headers:{
                        'Content-Type':'application/Json',
                    },
                }).then((res)=>res.json()).then((data)=>responseData=data); 
                setpople(responseData);  
            }
            catch(error){
                console.log(error);
            }
        }
         AllUsers();
    },[]);
    const fetchMessage= async(conversationId,user)=>{
        let responseData;
        try{
            await fetch(`http://localhost:5000/api/Messages/${conversationId}?senderId=${Sid?.Id}&&receiverid=${user?.reciverId}`,{
                method:"GET",
                // ...(conversationId==='new'&&{
                //     body:JSON.stringify({senderId:Sid?.Id, receiverid:message?.receiver?.reciverId})
                headers:{
                    'Content-Type':'application/Json',
                },
            }).then((res)=>res.json()).then((data)=>responseData=data); 
           
            console.log("resData=>",responseData ,"User",user); 
            setmessage({messages:responseData,receiver:user,conId:conversationId}); 
        }
        catch(error){
            console.log(error);
        }
    }
    
    const sendMessage= async(e)=>{
        let responseData;
        try{
            socket?.emit('sendMessage',{
                conversationId:message?.conId,
                senderId:Sid?.Id,
                text:sendMessages,
                receiverid:message?.receiver?.reciverId
            });
            await fetch(`http://localhost:5000/api/Messages`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/Json',
                },
                body:JSON.stringify({
                    conversationId:message?.conId,
                    senderId:Sid?.Id,
                    text:sendMessages,
                    receiverid:message?.receiver?.reciverId
                })
            })
            setsendMessage('');
        }
        catch(error){
            console.log(error);
        }
    }   
    return(
        <>
           <section className="" style={{overflowX:"hidden"}}>
              <div className="container-fulid p-0 m-0">
                <div className="row">
                        <div className="col-2 m-0 p-0 ">
                            <div className="text-white">
                                <div className="d-flex  p-2  justify-content-center align-items-center bg-primary" style={{background:""}} >
                                    <div>
                                        <div className="d-flex align-items-center ">
                                            <i className="h4 text-white bi bi-person-circle"></i>
                                            <p className="mx-2 h5">{user?.name.toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{height:"100%",background:"#2A2D2E"}}>  
                                    <div className="pt-3 px-4">
                                        <p>Find User</p>
                                    </div><hr/>
                                    <div className="sidebar_scroll">
                                    
                                        { 
                                            converesation.length>0?
                                              converesation.map(({conversationId,user})=>{
                                                return (
                                                    <>
                                                        <div className="pt-2 px-3">
                                                            <div className="d-flex align-items-center mt-3 " style={{cursor:"pointer"}} onClick={()=>fetchMessage(conversationId,user)}>
                                                                <i className="h2 text-white bi bi-person-circle "></i>
                                                                <div>
                                                                    <p className="m-0 mx-3 h5">{user.name.toUpperCase()}</p>
                                                                    <p className="m-0 mx-3  " style={{fontSize:"12px"}}>{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })
                                            : <div className="text-center mt-2">No Conversations</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8 m-0 p-0">
                            <div className="chats ">
                                <div className="m-0 w-100 bg-success" style={{ borderLeft:"2px sloid red",background:""}}>
                                    <div className="pt-1 d-flex px-3 w-100 justify-content-between">
                                        <p style={{fontSize:"23px"}}>{message?.receiver?.name.toUpperCase()}</p>
                                        <div  className=" mx-4 ">
                                            <span><i class="h3 mx-3 bi bi-camera-video-fill"></i></span>
                                            <span><i class="h3 mx-3 bi bi-person-plus-fill"></i></span>
                                            <span><i class="h3 mx-3 bi bi-three-dots-vertical"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <ScrollToBottom  className="massage_box  pt-5" style={{ overflow:"auto"}}>
                                <div className="">
                                {
                                    
                                    message?.messages?.length>0 ?
                                    message.messages.map(({message,user:{id}={}})=>{
                                            return (
                                                <>
                                                    <div className={`d-flex ${id===Sid?.Id?'right':'left'}  px-4`}>
                                                        <div className="text-dark mx-3 mt-1 " >
                                                            <div className= {`mb-3 ${id===Sid?.Id?'right bg-primary text-white':'left bg-secondary'}`}   style={{height:"30px",padding:"0px 50px 12px", borderRadius:"6px 0px 6px 6px" }}>
                                                                <p style={{fontSize:"18px"}} className="  p-0 m-0">{message}</p> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                    }) :

                                    <div  className=" d-flex justify-content-center align-items-center ">
                                        <p className="h4">No Message or No Conversation Selected</p>
                                    </div>  
                                }            
                                </div>
                               
                                </ScrollToBottom>
                                {
                                 message?.receiver?.name&&
                                     <div className="border bg-secondary shadow py-2 position-fixed"  style={{ width:"67.6%", bottom:"0px"}} >
                                        <input type="text"  value={sendMessages}  onChange={(e)=>setsendMessage(e.target.value)}  placeholder="Type a Massage"  style={{border:"none"}}  className="shadow-none bg-secondary rounded-0 form-control" />
                                        <button className={`btn btn-sm btn-success ${!sendMessages && 'disabled'}`} onClick={()=>sendMessage()}   style={{position:"absolute ",top:"11px",right:"20px"}}>
                                            <i class="bi bi-send"></i>
                                        </button>
                                     </div>
                                }

                            </div>
                        </div>
                        <div className="col-2 p-0 bg-dark">
                            <div className="py-2 bg-primary">
                                <p className="h4 text-white text-center">PEOPLE</p>
                            </div><hr/>
                            <div>
                                {
                                    people.length>0?
                                    people.map(({user})=>{
                                        return (
                                          <>
                                              <div className="pt-2 px-3">
                                                  <div className="d-flex align-items-center mt-3 " style={{cursor:"pointer"}} onClick={()=>fetchMessage('new',user)}>
                                                      {/* <i className="h2 text-white bi bi-person-circle "></i> */}
                                                      <div className="text-white">
                                                          <p className="m-0 mx-3 h5">{user?.name.toUpperCase()}</p>
                                                          <p className="m-0 mx-3  " style={{fontSize:"12px"}}>{user?.email}</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </>
                                      )    
                                  })
                                  : <div className="text-center mt-2">No People</div>
                                }
                            </div>
                        </div>
                    </div>  
              </div>
          </section>
        </>
    )
}
export default Sidebar;