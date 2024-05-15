import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom"

import axios from "axios"
axios.defaults.baseURL = process.env.REACT_APP_PORT;


const UserState = (props) => {

    const navigate = useNavigate()

    const [userDetails, setUserDetails] = useState()
    const [reloadUsers, setReloadUsers] = useState(true)
    const [selectedChat, setSelectedChat] = useState(null);
    const [notification, setNotification] = useState([])

    useEffect(() => {
        console.log(reloadUsers, "------------")
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUserDetails(userInfo);
        if (!userInfo) {
            navigate("/")
        }

    }, [navigate]);


    //signup user
    const signUp = async (input) => {
        try {
            const { cpassword, ...postData } = input;
            //console.log(postData)
            const response = await axios.post("/api/user", postData)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    const logIn = async (input) => {
        try {
            const response = await axios.post("/api/user/login", input)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const searchUsers = async (input) => {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.get(`/api/user?search=${input}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }

    // chat api 
    const addChatUser = async (input) => {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.post(`/api/chats`, { userId: input }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const getChatUser = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.get(`/api/chats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const createChatGroup = async (input) => {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.post(`/api/chats/group`, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const addUserToGroup = async (input) => {
        //console.log(input)
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.put(`/api/chats/groupadd`, {
                chatId: input.chatId,
                userId: input.userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            return { "status": 400, "message": error }
        }
    }

    const removeUserFromGroup = async (input) => {
        //console.log(input)
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.put(`/api/chats/groupremove`, {
                chatId: input.chatId,
                userId: input.userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            return { "status": 400, "message": error }
        }
    }

    const renameGroup = async (input) => {
        //console.log(input)
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.put(`/api/chats/renamegroup`, {
                chatId: input._id,
                chatName: input.chatName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            return { "status": 400, "message": error }
        }
    }

    const leaveGroup = async (input) => {
        //console.log("input", input)
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.put(`/api/chats/leavegroup`, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            return { "status": 400, "message": error }
        }
    }


    const sendMessage = async (input) => {
        //console.log(input)
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.post(`/api/message`, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            return { "status": 400, "message": error }
        }
    }

    const getMessage = async (input) => {
        //console.log("input", input)
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const response = await axios.get(`/api/message/${input.chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReloadUsers(!reloadUsers);
            return response
        } catch (error) {
            return { "status": 400, "message": error }
        }
    }


    return (
        <>
            <UserContext.Provider
                value={{ userDetails, signUp, logIn, searchUsers, addChatUser, getChatUser, reloadUsers, setReloadUsers, createChatGroup, selectedChat, setSelectedChat, renameGroup, addUserToGroup, removeUserFromGroup, leaveGroup, sendMessage, getMessage, notification, setNotification }}>
                {props.children}
            </UserContext.Provider>
        </>
    )
}

export default UserState