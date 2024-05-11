import { useToast, Avatar, Box, Button, Heading, Image, Menu, MenuButton, MenuItem, MenuList, Select } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import UserContext from '../../context/UserContext'
import { useState } from 'react'
import MyModal from '../ChatHelpers/MyModal'
import ChatSearch from '../../components/ChatComponents/ChatSearch'
import { useNavigate } from 'react-router-dom'



const TopBar = () => {
    const navigate = useNavigate()
    const { userDetails } = useContext(UserContext)
    const [profileModal, setProfileModal] = useState(false)
    const [searchModal, setSearchModal] = useState(false)
    const toast = useToast()

    const handleProfile = () => {
        setProfileModal(true)
    }

    const handleLogout = () => {
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
                            <Heading>Chat - App</Heading>
                            <Box display="flex" gap={2}>
                                <Menu>
                                    <MenuButton>
                                        <BellIcon fontSize={40} color={'orange'} />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem>Download</MenuItem>
                                        <MenuItem>Create a Copy</MenuItem>
                                        <MenuItem>Mark as Draft</MenuItem>
                                        <MenuItem>Delete</MenuItem>
                                        <MenuItem>Attend a Workshop</MenuItem>
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