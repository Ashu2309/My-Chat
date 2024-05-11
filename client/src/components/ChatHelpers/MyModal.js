import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Image, Text } from '@chakra-ui/react';
import { useContext, useState, useEffect } from 'react';
import UserContext from '../../context/UserContext';
import { getSender } from '../ConfigLogics/ChatLogics';

const MyModal = ({ children, clickedFrom }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userDetails, selectedChat } = useContext(UserContext);
    const [loggedUser, setLoggedUser] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (clickedFrom === 'SingleChat') {
            const storedUser = JSON.parse(localStorage.getItem("userInfo"));
            setLoggedUser(storedUser);
        }
    }, [clickedFrom]);

    useEffect(() => {
        if (clickedFrom === 'SingleChat' && loggedUser && selectedChat) {
            setUser(getSender(loggedUser, selectedChat?.users));
        } else if (clickedFrom === 'TopBar') {
            setUser(userDetails);
        }
    }, [clickedFrom, userDetails, selectedChat, loggedUser]);

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader textAlign={'center'} fontSize={'4xl'}>{user?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' justifyContent='center' alignContent='center' flexWrap={'wrap'} flexDirection='column'>
                        <Image src={user?.pic} alt="User image" h={200} w={200} borderRadius={'50%'} boxShadow={'lg'} />
                        <Text textAlign={'center'} mt={'2'}>{user?.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default MyModal;
