import { Avatar, Box, Button, Flex, FormControl, HStack, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, TagCloseButton, TagLabel, Text, Toast, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext'


const UpdateGroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [keyword, setKeyword] = useState("")
    const { searchUsers, createChatGroup, selectedChat, setSelectedChat, renameGroup, addUserToGroup, removeUserFromGroup, leaveGroup } = useContext(UserContext)
    const [allUsers, setAllUsers] = useState([])
    const [addallUsers, setaddAllUsers] = useState({
        "_id": selectedChat._id,
        "chatName": selectedChat.chatName,
        "userId": ""
    })
    const toast = useToast()

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
        const response = await addUserToGroup({ "chatId": selectedChat._id, "userId": elem })
        console.log(response)
        if (response.status === 400) {
            toast({
                title: "Only Admins Can Add !",
                status: "error"
            })
        } else {
            setSelectedChat(response.data)
        }
    }

    const handleRemove = async (elem) => {
        const response = await removeUserFromGroup({ "chatId": selectedChat._id, "userId": elem })
        console.log(response)
        if (response.status === 400) {
            toast({
                title: "Only Admin Can Remove !",
                status: "error"
            })
        } else {
            setSelectedChat(response.data)
        }

    }

    const handleRename = async () => {
        const response = await renameGroup(addallUsers)
        console.log(response)
        if (response.status === 400) {
            toast({
                title: "Only Admin Can Rename !",
                status: "error"
            })
        } else {
            setSelectedChat(response.data)
        }
    }

    const handleLeaveGroup = async () => {
        const response = await leaveGroup({ chatId: selectedChat._id })
        console.log(response)
        setSelectedChat(false)
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize={"2xl"}>{selectedChat?.chatName}</Text>
                        <FormControl>
                            <InputGroup>
                                <Input placeholder='Update Chat Name' marginBottom="10px" value={addallUsers.chatName} name="chatName" onChange={(e) => setaddAllUsers(prev => ({ ...prev, chatName: e.target.value }))}></Input>
                                <Button marginLeft={"10px"} colorScheme='green' onClick={handleRename}>Update</Button>
                            </InputGroup>
                            <Input placeholder='Add User' onChange={(e) => setKeyword(e.target.value)}></Input>
                            <Flex flexWrap="wrap">
                                {Array.isArray(selectedChat.users) && selectedChat.users.map((elem, key) => (
                                    <Tag
                                        size='lg' colorScheme='cyan' borderRadius='full'
                                        marginY="5px" marginRight="5px"
                                        key={key}
                                    >
                                        <Avatar
                                            src={elem?.pic}
                                            size='xs'
                                            name='Segun Adebayo'
                                            ml={-1}
                                            mr={2}></Avatar>
                                        <TagLabel>{elem?.name}</TagLabel>
                                        <TagCloseButton onClick={() => handleRemove(elem._id)} />
                                    </Tag>
                                ))}
                            </Flex>
                        </FormControl>
                        <Box className='custom-scrollbar' overflowY="scroll" height="40vh">
                            {allUsers.length > 0 && allUsers.map((elem, key) => (
                                <Box key={key} boxShadow={'md'}>
                                    <Box display="flex" alignItems="center" padding="10px" cursor="pointer" onClick={(e) => handleAddChat(elem._id)}>
                                        <Avatar src={elem.pic} marginRight={'7px'} />

                                        <VStack alignItems="start">
                                            <Text>{elem?.name}</Text>
                                            <Text>{elem?.email}</Text>
                                        </VStack>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={handleLeaveGroup}>
                            Exit Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default UpdateGroupModal