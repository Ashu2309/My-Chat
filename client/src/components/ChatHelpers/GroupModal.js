import { Avatar, Box, Button, Flex, FormControl, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, TagCloseButton, TagLabel, Text, Toast, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext'

const GroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [keyword, setKeyword] = useState("")
    const { searchUsers, createChatGroup } = useContext(UserContext)
    const [allUsers, setAllUsers] = useState([])
    const [addallUsers, setaddAllUsers] = useState({
        "chatName": "",
        "users": []
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
        if (!addallUsers.users.find(user => user._id === elem._id)) {
            setaddAllUsers((prev) => ({ ...prev, users: [elem, ...prev.users] }));
        } else {
            toast({
                title: "User Already Present",
                status: "error"
            })
        }
    }

    const handleRemove = (elemToRemove) => {
        setaddAllUsers((prev) => ({
            ...prev,
            users: prev.users.filter(elem => elem !== elemToRemove)
        }));
    }


    const handleAddGroup = async () => {
        const userIds = addallUsers.users.map(user => user._id);
        if (userIds.length < 3) {
            toast({
                title: "Atleast 3 User Required To Form A Group !",
                status: "error"
            })
            return;
        }
        if (addallUsers.chatName === "") {
            toast({
                title: "Fill Chat Name!",
                status: "error"
            })
            return;
        }
        const input = {
            chatName: addallUsers.chatName,
            users: JSON.stringify(userIds)
        };
        const response = await createChatGroup(input);
        setaddAllUsers({
            "chatName": "",
            "users": []
        })
        onClose()
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input placeholder='Chat Name' marginBottom="10px" value={addallUsers.chatName.value} name="chatName" onChange={(e) => setaddAllUsers(prev => ({ ...prev, chatName: e.target.value }))}></Input>
                            <Input placeholder='Add User' onChange={(e) => setKeyword(e.target.value)}></Input>
                            <Flex flexWrap="wrap">
                                {Array.isArray(addallUsers.users) && addallUsers.users.map((elem) => (
                                    <Tag
                                        size='lg' colorScheme='cyan' borderRadius='full'
                                        marginY="5px" marginRight="5px"
                                    >
                                        <Avatar
                                            src={elem?.pic}
                                            size='xs'
                                            name='Segun Adebayo'
                                            ml={-1}
                                            mr={2}></Avatar>
                                        <TagLabel>{elem?.name}</TagLabel>
                                        <TagCloseButton onClick={() => handleRemove(elem)} />
                                    </Tag>
                                ))}
                            </Flex>
                        </FormControl>
                        <Box className='custom-scrollbar' overflowY="scroll" height="40vh">
                            {allUsers.length > 0 && allUsers.map((elem, key) => (
                                <Box key={key} boxShadow={'md'}>
                                    <Box display="flex" alignItems="center" padding="10px" cursor="pointer" onClick={(e) => handleAddChat(elem)}>
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
                        <Button colorScheme='blue' mr={3} onClick={handleAddGroup}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default GroupModal