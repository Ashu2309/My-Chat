import React, { useContext } from 'react'
import UserContext from '../../context/UserContext'
import SingleChat from './SingleChat'

const ChatBox = () => {
    const { selectedChat, setSelectedChat, getChatUser } = useContext(UserContext)
    return (
        <>
            <SingleChat selectedChat={selectedChat} setSelectedChat={setSelectedChat}></SingleChat>

        </>
    )
}

export default ChatBox