import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'

const ChatBox = () => {
  const { selectedChat, theme } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])
  return (
    <div className='flex-1 flex-col flex justify-between m-5 md:m-10 xl:mx-30 overflow-y-auto max-md:mt-14 2xl:pr-40'>
      {/* chat messages */}
      <div className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img className='w-full max-w-56 sm:max-w-68'
              src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" />
            <p className='mt-5 text-xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything!</p>
          </div>
        )}
      </div>
      {messages.map((message, index) => {
        console.log("Rendering Message", message);
        return (
          <Message key={index} message={message} />
        )
      })}
      {/* prompt input box */}
      <form action="">

      </form>
    </div>
  )
}

export default ChatBox
