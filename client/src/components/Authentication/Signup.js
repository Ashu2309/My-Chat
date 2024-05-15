import React, { useContext, useState } from 'react'
import { useToast, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react"
import UserContext from '../../context/UserContext';


const Signup = () => {

    const { signUp } = useContext(UserContext)

    const handleSubmit = async () => {
        if (input.name === "" || input.email === "" || input.password === "" || input.cpassword === "" || input.pic === "") {
            toast({
                title: "Fill All Field!",
                status: "error"
            })
            return;
        }
        const response = await signUp(input)
        if (response && response.status === 200) {
            toast({
                title: "Account Created Successfully!",
                status: "success"
            })
        } else {
            toast({
                title: "Failed To Create Account !",
                status: "error"
            })
        }
    }

    const toast = useToast({
        duration: 3000,
        isClosable: true,
    });
    const [input, setinput] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
        pic: ""
    })
    const [loading, setLoading] = useState(false);

    const [show, setshow] = useState(0)
    const handleImage = (photo) => {
        setLoading(true)
        if (photo === undefined) {
            toast({
                title: "Please Select an Image",
                status: "warning"
            })
        }
        if (photo.type === "image/jpeg" || photo.type === "image/jpg" || photo.type === "image/png") {
            const data = new FormData()
            data.append("file", photo)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "ashutosh-coder")
            fetch("https://api.cloudinary.com/v1_1/ashutosh-coder/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json()).then(data => {
                setinput({ ...input, pic: data.url.toString() });
                //console.log(data.url.toString())
                setLoading(false)
            }).catch(error => {
                //console.log(error)
                setLoading(error)
            })
        } else {
            toast({
                title: "Please Select JPG/JPEG/PNG Image",
                status: "error"
            })
        }
    }
    const handleInput = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value })
    }
    //console.log(input)
    return (
        <>
            <VStack height="55vh" justifyContent="space-between">
                <FormControl>
                    <Input type='text' placeholder='Name' name='name' value={input.name} onChange={(e) => { handleInput(e) }} />
                </FormControl>
                <FormControl>
                    <Input type='email' placeholder='Email' name='email' value={input.email} onChange={(e) => { handleInput(e) }} />
                </FormControl>
                <FormControl>
                    <InputGroup>
                        <Input type={show ? 'text' : 'password'} placeholder='Password' name='password' value={input.password} onChange={(e) => { handleInput(e) }} />
                        <InputRightElement>
                            <Button px='5' onClick={() => { setshow(!show) }}>{show ? "Show" : "Hide"}</Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <InputGroup>
                        <Input type={show ? 'text' : 'password'} placeholder='Confirm Password' name='cpassword' value={input.cpassword} onChange={(e) => { handleInput(e) }} />
                        <InputRightElement>
                            <Button onClick={() => { setshow(!show) }}>{show ? "Show" : "Hide"}</Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Upload your profile Picture</FormLabel>
                    <InputGroup>
                        <Input variant='solid' type='file' p={1.5} accept='image/*' name='pic' onChange={(e) => { handleImage(e.target.files[0]) }} ></Input>
                    </InputGroup>
                </FormControl>
                <Button variant='solid' colorScheme='blue' w='100%' isLoading={loading ? true : false} onClick={handleSubmit}>Signup</Button>
            </VStack >
        </>
    )
}

export default Signup