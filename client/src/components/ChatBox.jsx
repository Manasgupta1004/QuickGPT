import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {
  const { selectedChat, theme, user, axios, token, setUser } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('text')
  const [prompt, setPrompt] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  const onSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!user) return toast('Login to send message')
      setLoading(true)
      const promptCopy = prompt
      setPrompt('')
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

      const { data } = await axios.put(`/api/message/${mode}`, { chatId: selectedChat._id, prompt, isPublished }, {
        headers: { Authorization: token }
      })
      if (data.success) {
        setMessages(prev => [...prev, data.reply])
        // decrease credits
        if (mode === 'image') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        } else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
      console.log('error:', error)
    }finally{
      setPrompt('')
      setLoading(false)
    }
  }
  //console.log(Message);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])
  return (
    <div className='flex-1 flex-col flex justify-between m-5 md:m-10 xl:mx-30 overflow-y-auto max-md:mt-14 2xl:pr-40'>
      {/* chat messages */}

      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img className='w-full max-w-56 sm:max-w-68'
              src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" />
            <p className='mt-5 text-xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything!</p>
          </div>
        )}

        {messages.map((message, index) => {
          // console.log("Rendering Message", message);
          return (
            <Message key={index} message={message} />
            // Message({ message })
          )
        })}
        {/* three dot loading */}
        {
          loading && (
            <div className='loader flex items-center gap-1.5'>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            </div>
          )
        }
      </div>
      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'>Published Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}
      {/* prompt input box */}
      <form onSubmit={onSubmit} action="" className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-2.5 pl-4 mx-auto flex gap-4 items-center'>
        <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-line' name="" id="">
          <option className='dark:bg-purple-900' value="text">Text</option>
          <option className='dark:bg-purple-900' value="image">Image</option>
        </select>
        <input required value={prompt} onChange={(e) => setPrompt(e.target.value)}
          type="text" placeholder='Type your prompt here...' className='flex-1 w-full text-sm outline-none' />
        <button className={prompt === '' ? 'opacity-70' : ''} disabled={prompt === '' || loading}>
          <img src={loading ? assets.stop_icon : assets.send_icon} alt="" className="w-8 cursor-pointer" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox