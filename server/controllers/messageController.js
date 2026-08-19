import openai from "../configs/openAi.js"
import Chat from "../models/chats.js"
import User from '../models/user.js'
import axios from 'axios'
import imagekit from "../configs/imageKit.js"


// Text based AI chat messsage controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId, prompt } = req.body

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" })
        }

        const chat = await Chat.findOne({ _id: chatId, userId })
        // console.log("USER ID:", userId)
        // console.log("CHAT ID:", chatId)
        // console.log("CHAT:", chat)
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-3.6-flash",
            messages: [
                // {
                //     role: "system",
                //     content: "You are a helpful assistant."
                // },
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

export const imageMessageContoller = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId, prompt, isPublished } = req.body

        //check credit
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" })
        }
        const chat = await Chat.findOne({ _id: chatId, userId })
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        // encode the prompt
        const encodedPrompt = encodeURIComponent(prompt)

        // construct ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`

        // Trigger generating by fecting from ImageKit
      //  console.log("STEP 1")
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' })

        //conver to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`
     //   console.log("STEP 2 - IMAGE GENERATED")
        //upload to Imagekit media library
        const uploadResponse = await imagekit.files.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: 'quickgpt'
        })
        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }
      //  console.log("STEP 3 - IMAGE UPLOADED")

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })
        return res.json({ success: true, reply })

    } catch (error) {
        console.log("FULL ERROR:", error)
        console.log("ERROR MESSAGE:", error.message)

        return res.json({ success: false, message: error.message })
    }
}
