import React, { useContext, useEffect } from 'react'
import UserContext from '../../context/UserContext'
import GroupChat from './GroupChat'
import SingleChat from './SingleChat'

const ChatBox = () => {
    const { selectedChat, setSelectedChat, getChatUser } = useContext(UserContext)
    return (
        <>
            {selectedChat?.isGroupChat ?
                <GroupChat selectedChat={selectedChat} setSelectedChat={setSelectedChat}></GroupChat>
                :
                <SingleChat selectedChat={selectedChat} setSelectedChat={setSelectedChat}></SingleChat>
            }
        </>
    )
}

export default ChatBox