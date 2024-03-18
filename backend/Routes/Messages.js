import express from "express";
import MessagesController from "../Controller/MessagesController.js";
const route = express.Router();
route.post("/", MessagesController.createMessage);
route.get("/:conversationId", MessagesController.findConversationMessages);

export default route;