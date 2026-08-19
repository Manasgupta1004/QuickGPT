import chat from "../models/chats.js"


// APi controller for creating a new chat

export const createChat = async (req, res) => {
    try {
        const userId = req.user._id

        const chatData = {
            userId,
            messages: [],
            name: 'New Chat',
            userName: req.user.name
        }

        await chat.create(chatData)
        res.json({ success: true, chatData })
    } catch (error) {
        res.json({ success: false, message: error })
    }
}

// API controller for getting al chats

export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await chat.find({ userId }).sort({ updatedAt: -1 })

        res.json({ success: true, chats })
    } catch (error) {
        res.json({ success: false, message: error })
    }
}

// API controller fro deleting chats

export const deleteChats = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId } = req.body

        await chat.deleteOne({ _id: chatId, userId })
        res.json({ success: true, message: "chat deleted successfully" })
    } catch (error) {
        res.json({ success: false, message: error })
    }
}

