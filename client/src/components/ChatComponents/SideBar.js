import { Avatar, Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext'
import { getSender } from '../ConfigLogics/ChatLogics'
import { AddIcon } from '@chakra-ui/icons'
import GroupModal from '../ChatHelpers/GroupModal'
import group_img from "../../Assets/Img/group_icon.png"

const SideBar = () => {
    const { getChatUser, reloadUsers, setSelectedChat, selectedChat } = useContext(UserContext)
    const [allChatUsers, setAllChatUsers] = useState([])
    const [loggedUser, setloggedUser] = useState(null)



    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                const response = await getChatUser();
                if (response && response.data) {
                    setAllChatUsers(response.data);
                    //console.log(response.data);
                } else {
                    console.error("No data returned from getChatUser");
                }
            } catch (error) {
                console.error("Error fetching user chats:", error);
            }
        };

        if (selectedChat !== null || reloadUsers) {
            fetchUserChats();
        }
        setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    }, [selectedChat, reloadUsers]);

    //console.log("selectedChat", selectedChat)

    const selectChat = (e) => {
        setSelectedChat(e)
    }


    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px" backgroundColor="#fff" className='mychat_heading'>
                <Text fontSize={{ lg: "1.6rem", md: "1.2rem", sm: "1.6rem" }} fontWeight="bold">MY CHATS</Text>
                <GroupModal>
                    <Button variant="solid" colorScheme='green'><AddIcon marginRight={2} /> Create Group</Button>
                </GroupModal>
            </Box>
            <Box height="calc(100vh - (var(--mychat_heading) + var(--top_bar_height)))" padding='10px' backgroundColor="#e7e7e7" overflowY="scroll" className="custom-scrollbar">

                {allChatUsers.length > 0 && allChatUsers.map((elem, key) => (
                    <Box key={key} boxShadow={'md'} backgroundColor="#fff">
                        {elem.isGroupChat ? (
                            <Box display="flex" alignItems="center" padding="10px" marginBottom="10px" cursor="pointer" onClick={(e) => selectChat(elem)}>
                                <Avatar src={group_img} marginRight={'7px'} />
                                <VStack alignItems="start">
                                    <Text fontWeight="600">{elem.chatName}</Text>
                                    <Text>{elem?.latestMessage?.content ? elem?.latestMessage?.content : 'No recent message'}</Text>
                                </VStack>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" padding="10px" marginBottom="10px" cursor="pointer" onClick={(e) => selectChat(elem)}>
                                <Avatar src={getSender(loggedUser, elem.users)?.pic} marginRight={'7px'} />
                                <VStack alignItems="start">
                                    <Text fontWeight="600" marginRight="5px">{getSender(loggedUser, elem.users)?.name}</Text>

                                    <Text color="green">{elem?.latestMessage?.content ? elem?.latestMessage?.content : 'No recent message'}</Text>

                                </VStack>
                            </Box>
                        )}
                    </Box>
                ))}
                {allChatUsers.length === 0 && (
                    <Box display={'flex'} height="calc(100vh - 160px)" alignItems={'center'} justifyContent={'center'}>
                        <Heading>No Chats</Heading>
                    </Box>
                )}
            </Box >
        </>
    )
}

export default SideBar