import openai from "../configs/openAi.js"
import Chat from "../models/chats.js"
import User from '../models/user.js'


// Text based AI chat messsage controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId, prompt } = req.body

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" })
        }

        const chat = await Chat.findOne({ _id: chatId, userId })
    
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-3.6-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        })
        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
        return res.json({ success: true, response: reply })
    } catch (error) {
        return res.json({ msg: 'api err', success: false, message: error.message, })
    }
}

// image generation message controller

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId, prompt, isPublished } = req.body

        // Check credits
        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            })
        }

        // Find chat
        const chat = await Chat.findOne({
            _id: chatId,
            userId
        })

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            })
        }

        // Save user's message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        // Generate image using Gemini
        const image = await openai.images.generate({
            model: "gemini-2.5-flash-image",
            prompt: prompt,
            n: 1,
            response_format: "b64_json"
        })

        console.log("IMAGE GENERATED")

        // Get base64 image
        const base64Image = image.data?.[0]?.b64_json

        if (!base64Image) {
            return res.json({
                success: false,
                message: "Gemini did not return an image"
            })
        }

        // Create image URL for frontend
        const imageUrl =
            `data:image/png;base64,${base64Image}`

        // Assistant reply
        const reply = {
            role: "assistant",
            content: imageUrl,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }

        // Save assistant message
        chat.messages.push(reply)

        // Save chat
        await chat.save()

        // Deduct 2 credits
        await User.updateOne(
            { _id: userId },
            { $inc: { credits: -2 } }
        )

        return res.json({
            success: true,
            reply
        })

    } catch (error) {

        console.log("IMAGE ERROR:", error)

        return res.json({
            success: false,
            message: error.message
        })
    }
}