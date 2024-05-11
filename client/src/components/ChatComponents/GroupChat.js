import { IoIosArrowBack } from "react-icons/io";
import { RxDotsVertical } from "react-icons/rx";
import { Avatar, Box, FormControl, Heading, Input, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UpdateGroupModal from "../ChatHelpers/UpdateGroupModal";
import UserContext from "../../context/UserContext";
import chat_bg from "../../Assets/Img/bg_chat.jpg"
const GroupChat = ({ selectedChat, setSelectedChat }) => {

    const { sendMessage, getMessage } = useContext(UserContext)
    const [loggedUser, setloggedUser] = useState(null)
    const [content, setcontent] = useState("")
    const [messages, setMessages] = useState([])

    const toast = useToast()
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

    useEffect(() => {
        setloggedUser(JSON.parse(localStorage.getItem("userInfo")))
    }, [])

    const handleSubmit = async (e) => {
        if (e.key === 'Enter' && content) {
            try {
                setcontent("")
                const { data } = await sendMessage({ "chatId": selectedChat._id, "content": content });
                console.log(data)
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
        console.log(data)
        setMessages(data)
    }

    useEffect(() => {
        fectchChatsUser();
    }, [selectedChat])

    const randomColor = () => {
        const colors = ['#1F618D', '#154360', '#7E5109', '#6E2C00', '#6C3483', '#512E5F', '#A93226', '#943126', '#2874A6', '#1F618D'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    console.log("messages", messages)

    return (
        <Box backgroundColor="#dcffff" height="100%" >
            <Box backgroundColor="#fff" height="var(--mychat_heading)" display="flex" alignItems="center" justifyContent="space-between" paddingX={"10px"}>
                {selectedChat && (
                    <>
                        <IoIosArrowBack onClick={() => setSelectedChat()} fontSize={"30px"} />
                        <Heading>
                            {selectedChat?.chatName.toUpperCase()}
                        </Heading>
                    </>
                )}

                <UpdateGroupModal>
                    <RxDotsVertical fontSize={"30px"} cursor={"pointer"} />
                </UpdateGroupModal>
            </Box>
            {selectedChat && (
                <>
                    <Box paddingX="10px" height="calc(100vh - (var(--mychat_heading) + var(--top_bar_height)))" backgroundColor="#dcffff" display="flex" flexDirection="column" style={{ backgroundImage: `url(${chat_bg})`, backgroundSize: "100% 100%" }}>
                        <Box height="calc(100vh - (var(--mychat_heading) + var(--top_bar_height) + 60px))" overflowY="auto" ref={msgContainer} className="custom-scrollbar">
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
                                            <Box margin="10px" padding="10px">
                                                <Text fontWeight="700" style={{ color: randomColor() }}>{elem.sender.name}</Text>
                                                <span>{elem.content}</span>
                                            </Box>
                                        </Box>
                                    )
                            ))}
                        </Box>

                        <FormControl paddingRight="10px">
                            <Input type="text" placeholder="Type here ..." backgroundColor="#fff" value={content} onChange={(e) => setcontent(e.target.value)} onKeyDown={(e) => handleSubmit(e)}></Input>
                        </FormControl>
                    </Box>
                </>
            )
            }
        </Box>
    )
}

export default GroupChat