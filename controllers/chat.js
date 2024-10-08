const { userModel } = require("../models/userModel");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const { runChat } = require("../utils/addGeminiResponse");
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new chat session
    const newChat = new chatModel({
      user: userId,
    });

    // Save the new chat session
    await newChat.save();

    // Return the chat ID in the response
    res.status(201).json({ chatId: newChat._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// get users chat
exports.getUserChat = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userChat = await chatModel.find({ user: userId });
    console.log(userChat);
    // Return the chat ID in the response
    res.status(200).json(userChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
// gemini chat
exports.chatWithGemini = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { id } = req.params;
    let response = await runChat(prompt);
    let text =
      "Sorry, some prompts are limited for safety or try checking out ur network and connect to the internet. Would you like to try rephrasing your prompt or choosing a different one? I'm happy to help you explore some ideas";
    response = response ?? text;
    const chat = await chatModel.findById(id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Save user's message
    const userMessage = new messageModel({
      role: "user",
      parts: prompt,
      chat: id,
    });
    await userMessage.save();

    // Save model's response
    const modelResponse = new messageModel({
      role: "model",
      parts: response,
      chat: id,
    });
    await modelResponse.save();

    // Update the chat session to include the message IDs
    chat.messages.push(userMessage._id, modelResponse._id);
    await chat.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { id } = req?.params;
    if (id == null || !id) {
      console.log(id, "not authorized,register");
      return res.status(401).json({ message: "register" });
    }

    // Query the database for messages associated with the chat ID
    const messages = await messageModel.find({ chat: id });
    console.log("messages", messages);
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
