import { useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Button, Box, Heading, VStack, Avatar, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';

const ChatSearch = ({ searchModal, setSearchModal }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalOpen, setModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("")
    const { searchUsers, addChatUser } = useContext(UserContext)
    const [allUsers, setAllUsers] = useState([])


    useEffect(() => {
        if (searchModal) {
            onOpen();
            setSearchModal(true)
        } else {
            setModalOpen(false);
            onClose();
        }
    }, [searchModal, onOpen, onClose]);

    // Handle closing the modal and updating state if modal is manually closed
    const handleCloseModal = () => {
        setModalOpen(false);
        onClose();
        setSearchModal(false);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await searchUsers(keyword);
            setAllUsers(response.data)
        }
        if (keyword !== "") {
            fetchUsers();
        } else {
            setAllUsers([])
        }

    }, [keyword])

    const handleAddChat = async (elem) => {
        const response = await addChatUser(elem);
    }



    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={handleCloseModal}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Search User</DrawerHeader>

                <DrawerBody className='custom-scrollbar' overflowX="hidden">
                    <Input placeholder='Type here...' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    {allUsers.length > 0 && allUsers.map((elem, key) => (
                        <Box key={key} boxShadow={'md'}>
                            <Box display="flex" alignItems="center" padding="10px" cursor="pointer" onClick={(e) => handleAddChat(elem._id)}>
                                <Avatar src={elem?.pic} marginRight={'7px'} />

                                <VStack alignItems="start">
                                    <Text>{elem?.name}</Text>
                                    <Text>{elem?.email}</Text>
                                </VStack>
                            </Box>
                        </Box>
                    ))}


                </DrawerBody>


            </DrawerContent>
        </Drawer>
    );
};

export default ChatSearch;
