import { useToast, Avatar, Box, Button, Heading, Image, Menu, MenuButton, MenuItem, MenuList, Select } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import UserContext from '../../context/UserContext'
import { useState } from 'react'
import MyModal from '../ChatHelpers/MyModal'
import ChatSearch from '../../components/ChatComponents/ChatSearch'
import { useNavigate } from 'react-router-dom'
import { getSender } from '../ConfigLogics/ChatLogics'





const TopBar = () => {
    const navigate = useNavigate()
    const { userDetails, notification, setNotification, setSelectedChat, selectedChat } = useContext(UserContext)
    const [profileModal, setProfileModal] = useState(false)
    const [searchModal, setSearchModal] = useState(false)
    const toast = useToast()

    const handleProfile = () => {
        setProfileModal(true)
    }

    const handleLogout = () => {
        setSelectedChat(null)
        localStorage.removeItem("userInfo");
        navigate("/")

    }
    return (
        <>
            {userDetails === null ? (<>
                {
                }
            </>)
                : (
                    <>
                        <Box display="flex" justifyContent={'space-between'} padding="10px" backgroundColor={'#f6f4f4'} className='topbar' >
                            <Button variant={'ghost'} onClick={() => setSearchModal(true)} > Search <Search2Icon margin={2} /></Button>
                            <Heading>Chat-Hub</Heading>
                            <Box display="flex" gap={2}>
                                <Menu>
                                    <MenuButton position="relative">
                                        <BellIcon fontSize={40} color={'orange'}>
                                        </BellIcon>
                                        {!notification.length ? (<></>) :
                                            <span className='add_pop'>{notification.length}</span>
                                        }
                                    </MenuButton>
                                    <MenuList>
                                        {!notification.length && <>
                                            <MenuItem>No Messages</MenuItem>
                                        </>}
                                        {notification.map(notif => (
                                            <MenuItem key={notif._id} onClick={() => {
                                                setSelectedChat(notif.chat);
                                                setNotification(notification.filter((n) => n !== notif))
                                            }
                                            }>
                                                {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                                                    :
                                                    `New Message from ${getSender(userDetails, notif.chat.users)?.name}`
                                                }
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>

                                <Menu>
                                    <MenuButton>
                                        <Avatar src={userDetails?.pic} name={userDetails?.name} alt="Default Image" boxSize="40px" mr={2} />
                                    </MenuButton>
                                    <MenuList>
                                        <MyModal clickedFrom="TopBar"><MenuItem>Profile - {userDetails?.name}</MenuItem></MyModal>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Box>
                        <ChatSearch searchModal={searchModal} setSearchModal={setSearchModal} ></ChatSearch>
                    </>
                )}
        </>
    )
}

export default TopBar