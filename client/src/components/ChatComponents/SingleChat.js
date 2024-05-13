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
import ScrollableChats from "./ScrollableChats";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ selectedChat, setSelectedChat }) => {

    const { sendMessage, getMessage, notification, setNotification, reloadUsers, setReloadUsers } = useContext(UserContext)
    const [loggedUser, setloggedUser] = useState(null)
    const [content, setcontent] = useState("")
    const [messages, setMessages] = useState([])
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, settyping] = useState(false)
    const [isTyping, setisTyping] = useState(false)



    const toast = useToast()

    useEffect(() => {
        setloggedUser(JSON.parse(localStorage.getItem("userInfo")))
    }, [])

    useEffect(() => {
        socket = io(ENDPOINT);
        if (loggedUser) {
            //console.log("loggedUser", loggedUser);
            socket.emit("setup", loggedUser);
            socket.on("connected", () => setSocketConnected(true));
            socket.on("typing", () => setisTyping(true))
            socket.on("stop typing", () => setisTyping(false))
        }
    }, [loggedUser]);

    useEffect(() => {
        fectchChatsUser();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                //give notification
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setReloadUsers(!reloadUsers)
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    //console.log("Notifications", notification)





    const typingHandler = (e) => {
        setcontent(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            settyping(true);
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timeLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timeLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                settyping(false)
            }
        }, timeLength)
    }


    const handleSubmit = async (e) => {
        if (e.key === 'Enter' && content) {
            socket.emit("stop typing", selectedChat._id)
            try {
                setcontent("")
                const { data } = await sendMessage({ "chatId": selectedChat._id, "content": content });
                //console.log(data)
                socket.emit("new message", data)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Could't send Message !",
                    status: "error"
                })
            }
        }
    }

    const fectchChatsUser = async () => {
        if (!selectedChat) return;
        const { data } = await getMessage({ "chatId": selectedChat._id })
        //console.log(data)
        setMessages(data)
        socket.emit("join chat", selectedChat._id)
    }





    //console.log("messages", messages)
    return (
        <Box backgroundColor="#dcffff" height="100%" >
            <Box height="var(--mychat_heading)" display="flex" alignItems="center" justifyContent="space-between" paddingX={"10px"} backgroundColor="#000" color="#fff">
                {selectedChat && (
                    selectedChat.isGroupChat ?
                        (
                            <>
                                {selectedChat && (
                                    <>
                                        <IoIosArrowBack onClick={() => setSelectedChat()} fontSize={"30px"} />
                                        <Heading display="flex" alignItems="end">
                                            {selectedChat?.chatName.toUpperCase()}
                                            {isTyping ? (
                                                <Text fontSize="xs" marginLeft="10px" color="lightgreen">Typing ...</Text>
                                            ) : <></>}
                                        </Heading>
                                    </>
                                )}

                                <UpdateGroupModal>
                                    <RxDotsVertical fontSize={"30px"} cursor={"pointer"} />
                                </UpdateGroupModal>
                            </>
                        )
                        :
                        <>
                            <IoIosArrowBack onClick={() => setSelectedChat()} fontSize={"30px"} />
                            <Heading display="flex" alignItems="end">
                                {getSender(loggedUser, selectedChat?.users)?.name.toUpperCase()}
                                {isTyping ? (
                                    <Text fontSize="xs" marginLeft="10px" color="lightgreen">Typing ...</Text>
                                ) : <></>}
                            </Heading>
                            <MyModal clickedFrom="SingleChat">
                                <RxDotsVertical fontSize={"30px"} cursor={"pointer"} />
                            </MyModal>
                        </>
                )}
            </Box>
            {
                selectedChat && (
                    <>
                        <Box paddingX="10px" height="calc(100vh - (var(--mychat_heading) + var(--top_bar_height)))" backgroundColor="#dcffff" display="flex" flexDirection="column" style={{ backgroundImage: `url(${chat_bg})`, backgroundSize: "100% 100%" }}>

                            <ScrollableChats messages={messages} loggedUser={loggedUser} isTyping={isTyping} />

                            {/* <Box height="calc(100vh - (var(--mychat_heading) + var(--top_bar_height) + 60px))" overflowY="auto" ref={msgContainer} className="custom-scrollbar">
                            {messages.map((elem, key) => (
                                loggedUser._id === elem.sender._id ? (
                                    <Box key={key} className="messages msgMe">
                                        <Avatar src={elem.sender.pic} />
                                        <Box margin="10px" padding="10px">{elem.content}</Box>
                                    </Box>
                                ) :
                                    (
                                        <Box key={key} className="messages msgSender">
                                            <Avatar src={elem.sender.pic} />
                                            <Box margin="10px" padding="10px">{elem.content}</Box>
                                        </Box>
                                    )
                            ))}
                            <Box marginY="10px">
                                {isTyping ? <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{ marginBottom: "6rem !important", marginLeft: 0 }}
                                ></Lottie> : <></>}
                            </Box>
                        </Box> */}

                            <FormControl paddingRight="10px">
                                <Input type="text" placeholder="Type here ..." backgroundColor="#fff" value={content} onChange={typingHandler} onKeyDown={(e) => handleSubmit(e)}></Input>
                            </FormControl>
                        </Box>
                    </>
                )
            }
        </Box >
    )
}

export default SingleChat