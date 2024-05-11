import { Box, Grid, GridItem } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import TopBar from '../components/ChatComponents/TopBar'
import SideBar from '../components/ChatComponents/SideBar'
import ChatBox from '../components/ChatComponents/ChatBox'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext'

const ChatPage = () => {
    const naviagte = useNavigate();

    const { selectedChat } = useContext(UserContext)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) naviagte("/chats");
        else naviagte("/")
    }, []);

    return (
        <>
            <Box w="100" h={'100'}>
                <TopBar></TopBar>
                <Grid templateColumns="repeat(12,1fr)" backgroundColor="#dcffff">
                    <GridItem colSpan={{ base: 12, md: 4, lg: 3 }} display={{ base: selectedChat ? "none" : "block", md: "block", lg: "block" }}>

                        <SideBar></SideBar>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 8, lg: 9 }}>
                        <ChatBox></ChatBox>
                    </GridItem>

                </Grid>
            </Box>
        </>
    )
}

export default ChatPage