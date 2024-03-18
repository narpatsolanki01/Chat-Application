import express from "express";
const route=express.Router(); 
import UserController from "../Controller/UserController.js";
route.post('/create',UserController.createUser);
route.post('/signin',UserController.signUser);
route.get('/:id',UserController.getUser);

export default route;