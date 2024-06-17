import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Toast,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [user, SetUser] = useState({ email: "", password: "" });
  console.log(user);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const ChangeInput = (e) => {
    SetUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const SubmitHandler = async (e) => {
    // e.preventDefault();
    setLoading(true);
    if (user.email === "" || user.password === "") {
      Toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(process.env.REACT_APP_ENDPOINT);
      console.log(process.env);

      const { email, password } = user;
      const { data } = await axios.post(
        `${process.env.REACT_APP_ENDPOINT}/api/user/login`,
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      SetUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={ChangeInput}
          type="email"
          name="email"
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your Password"
            onChange={ChangeInput}
            type={show ? "text" : "password"}
            name="password"
          ></Input>
          <InputRightElement width={"4.5rem"} name="show">
            <Button h="1.75rem" size={"sm"} onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      {/* <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        onClick={() => {
          SetUser({ email: "guest@example.com", password: "123456" });
        }}
      >
        Get User Credentials
      </Button> */}
    </VStack>
  );
};

export default Login;
