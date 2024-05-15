import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Box, Button, Container, FormControl, Input, InputGroup, InputRightElement, Toast, VStack, useToast } from "@chakra-ui/react"
import UserContext from '../../context/UserContext'

const Login = () => {

    const toast = useToast({
        duration: 3000,
        isClosable: true,
    });

    const navigate = useNavigate()

    const { logIn } = useContext(UserContext)

    const handleSubmit = async () => {
        if (input.email === "" || input.password === "") {
            toast({
                title: "Fill All Field!",
                status: "error"
            })
            return;
        }
        const response = await logIn(input)
        //console.log(response)
        if (response && response.status === 200) {
            localStorage.setItem("userInfo", JSON.stringify(response.data))
            toast({
                title: "Logged in Successfully!",
                status: "success"
            })
            navigate("/chats")
        } else {
            toast({
                title: "Invalid Credentials !",
                status: "error"
            })
        }
    }

    const [input, setinput] = useState({
        email: "",
        password: "",
    })

    const [show, setshow] = useState(0)

    const handleInput = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value })
    }
    //console.log(input)
    return (
        <>
            <VStack height="30vh" justifyContent="space-between">
                <FormControl>
                    <Input type='email' placeholder='Email' name='email' value={input.email} onChange={(e) => { handleInput(e) }} />
                </FormControl>
                <FormControl>
                    <InputGroup>
                        <Input type={show ? 'text' : 'password'} placeholder='Password' name='password' value={input.password} onChange={(e) => { handleInput(e) }} />
                        <InputRightElement>
                            <Button m="5px" onClick={() => { setshow(!show) }}>{show ? "Show" : "Hide"}</Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button variant='solid' colorScheme='blue' w='100%' onClick={handleSubmit}>Login</Button>
                <Button variant='solid' colorScheme='green' w='100%' onClick={() => { setinput({ "email": "guest@example.com", "password": "123456" }) }}>Guest Login</Button>
            </VStack >
        </>
    )
}

export default Login