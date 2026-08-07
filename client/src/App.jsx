import React from 'react'
import SideBar from './components/SideBar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Creadit from './pages/Credits'
import Community from './pages/Community'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { assets } from './assets/assets'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(true)
  return (
    <>
      {!isMenuOpen && <img onClick={() => setIsMenuOpen(true)}
        className='absolute top-3 left-3 w-8 g-8 cursor-pointer md:hidden not-dark:invert'
        src={assets.menu_icon} />}
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className="flex h-screen w-screen">
          {isMenuOpen && < SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Creadit />} />
            <Route path="/community" element={<Community />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
