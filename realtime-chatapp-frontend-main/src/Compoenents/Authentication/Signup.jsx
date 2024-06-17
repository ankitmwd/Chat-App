import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [user, SetUser] = useState({ pic: null });
  console.log(user);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const ChangeInput = (e) => {
    SetUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const SubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!user.name || !user.email || !user.password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
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
      const { data } = await axios.post(
        `${process.env.REACT_APP_ENDPOINT}/api/user`,
        user,
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
  const UploadImage = (e) => {
    e.preventDefault();
    setLoading(true);
    const Pic = e.target.files[0];
    if (Pic === undefined) {
      toast({
        title: "Please Upload a Image",
        description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (Pic.type === "image/jpeg" || Pic.type === "image/png") {
      var cloud = process.env.REACT_APP_CLOUD_NAME;
      const data = new FormData();
      data.append("file", Pic);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", cloud);
      fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          user.pic = data.url;
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Upload a Image",
        description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={ChangeInput}
          name="name"
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={ChangeInput}
          name="email"
          type="email"
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
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Profile Image</FormLabel>
        <Input
          placeholder="Upload Profile"
          name="pic"
          onChange={UploadImage}
          type="file"
          accept="image/*"
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
