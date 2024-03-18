import express from "express";
const route =express.Router();
import ConversationConroller from '../Controller/ConversationController.js';
route.post('/create',ConversationConroller.createConversation);
route.get('/:userId',ConversationConroller.findUserConversation);

export default route;