import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import chat_bg from "../Assets/Img/bg_chat.jpg"

function Homepage() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/chats");
    }, []);

    return (
        <Box height="100vh" style={{ backgroundImage: `url(${chat_bg})`, backgroundSize: "100% 100%" }} width="100vw !important" display="flex" alignItems="center" flexDirection="column" paddingX="4rem" justifyContent="center">
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w={{ lg: "40%", md: "80%", base: "100%" }}
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
                    Chat-Hub
                </Text>
            </Box>
            <Box bg="white" w={{ lg: "40%", md: "80%", base: "100%" }} p={4} borderRadius="lg" borderWidth="1px">
                <Tabs isFitted variant="enclosed-colored">
                    <TabList mb="1em">
                        <Tab>Login</Tab>
                        <Tab>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel >
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

        </Box>
    );
}

export default Homepage;