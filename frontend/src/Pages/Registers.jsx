import React, { useState } from "react";
import { Navigate} from "react-router-dom";
const Registers = () => {
    const [signstate, setsignstate] = useState('SignUp');
    // const Navigete=Navigate();
    const [errors, seterrors] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [user, setuser] = useState({
        ...(signstate !== 'SignUp' && {
            username: "",
        }),
        email: "",
        password: ""
    });

    const SignUps = async () => {
        let valid = true;
        if (!user.username) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                username: 'Name is required',
            }));
            valid = false;
        }
        if (!user.email) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                email: 'Email is required',
            }));
            valid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(user.email)) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                email: 'Invalid email format',
            }));
            valid = false;
        }

        if (!user.password) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password is required',
            }));
            valid = false;
        }
        if (valid) {
            try {
                let responseData;
                await fetch('http://localhost:5000/api/user/create', {
                    method: 'POST',
                    headers:{
                        Append: 'application/fomr-data',
                        'Content-Type': 'application/Json',
                    },
                    body: JSON.stringify(user)
                }).then((res) => res.json()).then((data) => responseData = data);

                if (responseData.success) {
                    sessionStorage.setItem("auth-token", responseData.token);
                    sessionStorage.setItem("detail", JSON.stringify(responseData.detail));
                    window.location.replace('/');

                }
                else {
                    seterrors((prevErrors) => ({
                        ...prevErrors,
                        email: responseData.massege,
                    }));
                }
            } catch (error) {
                alert(error);
            }
        }
    }

    const Logins = async () => {
            let valid=true;
        if (!user.email) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                email: 'Email is required',
            }));
            valid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(user.email)) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                email: 'Invalid email format',
            }));
            valid = false;
        }

        if (!user.password) {
            seterrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password is required',
            }));
            valid = false;
        }
         try{   
             if (valid) {
                    let responseData;
                    await fetch("http://localhost:5000/api/user/signin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/Json',
                        },
                        body: JSON.stringify(user)
                    }).then((res) => res.json()).then((data) => responseData = data);

                    if (responseData.success) {
                        sessionStorage.setItem("auth-token", responseData.token);
                        sessionStorage.setItem("detail", JSON.stringify(responseData.detail));
                        window.location.replace('/');

                    }
                    else {
                        seterrors((prevErrors) => ({
                            ...prevErrors,
                            email: responseData.massege,
                        }));
                    }
                }
            } 
            catch (err) {
                 window.location.replace('/notfound');
            }
    }

    const changeHandler = (e) => {
        setuser({ ...user, [e.target.name]: e.target.value });

        seterrors({
            ...errors,
            [e.target.name]: '',
        });
    }
    return (
        <>
            <section className="w-25 m-auto mt-5">
                <div>
                    <div className="card w-100 p-3 shadow">
                        <div className="card-body">
                            <h4 className="text-center">Sign UP</h4>
                            <form action="">
                                {signstate === "SignUp" ?
                                    <div className="mb-3">
                                        <label htmlFor="" className="mb-2">Name</label>
                                        <input type="text" name="username" value={setuser.username} onChange={changeHandler} placeholder="Enter Name " className="shadow-none form-control" />
                                        <span className="text-danger mt-1">{errors.username}</span>
                                    </div>
                                    : <></>}
                                <div className="mb-3">
                                    <label htmlFor="" className="mb-2">Email</label>
                                    <input type="text" name="email" value={setuser.email} onChange={changeHandler} placeholder="Enter Email " className="shadow-none form-control" />
                                    <span className="text-danger mt-1">{errors.email}</span>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="" className="mb-2">Password</label>
                                    <input type="text" name="password" value={setuser.password} onChange={changeHandler} placeholder="Enter Password " className="shadow-none form-control" />
                                    <span className="text-danger mt-1">{errors.password}</span>
                                </div>
                                <button type="button" className="mb-3 btn btn-primary" onClick={() => { signstate === "SignUp" ? SignUps() : Logins() }} >{signstate}</button>
                                {signstate === 'SignUp' ?
                                    <p  >Already exists Account <span className="text-danger fw-bold " onClick={() => { setsignstate("Login") }} style={{ cursor: "pointer" }} >Click Here</span></p>
                                    :
                                    <p >Create a Account <span className="text-danger fw-bold" onClick={() => { setsignstate("SignUp") }} style={{ cursor: "pointer" }} >Click Here</span></p>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Registers;