import { IoIosArrowBack } from "react-icons/io";
import { RxDotsVertical } from "react-icons/rx";
import { Avatar, Box, FormControl, Heading, Input, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useRef, useState } from 'react'
import { getSender } from '../ConfigLogics/ChatLogics'
import { useEffect } from 'react'
import UpdateGroupModal from "../ChatHelpers/UpdateGroupModal";
import MyModal from "../ChatHelpers/MyModal";
import UserContext from "../../context/UserContext";
import chat_bg from "../../Assets/Img/bg_chat.jpg"
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../../Assets/Img/animations/typing.json"

const ScrollableChats = ({ messages, loggedUser, isTyping }) => {

    const msgContainer = useRef();

    const scrollToBottom = () => {
        if (msgContainer.current) {
            msgContainer.current.scrollTop = msgContainer.current.scrollHeight;
        }
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const randomColor = () => {
        const colors = ['#1F618D', '#154360', '#7E5109', '#6E2C00', '#6C3483', '#512E5F', '#A93226', '#943126', '#2874A6', '#1F618D'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    //console.log("-----------------------------", messages)
    return (
        <>
            <Box height="calc(100vh - (var(--mychat_heading) + var(--top_bar_height) + 60px))" overflowY="auto" ref={msgContainer} className="custom-scrollbar">

                {messages.map((elem, key) => (
                    loggedUser._id === elem.sender._id ? (
                        <Box key={key} className="messages msgMe">
                            <Avatar src={elem.sender.pic} />
                            <Box margin="10px" padding="10px" position="relative">
                                {elem.content}
                                <Text className="timeMsg">
                                    {new Date(elem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </Box>

                        </Box>
                    ) :
                        (
                            <Box key={key} className="messages msgSender">
                                <Avatar src={elem.sender.pic} />
                                <Box margin="10px" padding="10px" position="relative">
                                    {elem.chat.isGroupChat &&
                                        <>

                                            <span style={{ color: randomColor(), fontWeight: 700, marginRight: "10px" }}>{elem.sender.name}</span>
                                            <span style={{ fontSize: "15px" }}>{`~${elem.sender.email}`}</span>
                                        </>
                                    }
                                    <Text>
                                        {elem.content}
                                    </Text>
                                    <Text className="timeMsg">
                                        {new Date(elem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </Box>
                            </Box>
                        )
                ))}
                <Box marginBottom="35px">
                    {isTyping ?
                        <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{ marginBottom: "6rem !important", marginLeft: 0 }}
                        ></Lottie> : <></>}
                </Box>

            </Box >
        </>
    )
}

export default ScrollableChats