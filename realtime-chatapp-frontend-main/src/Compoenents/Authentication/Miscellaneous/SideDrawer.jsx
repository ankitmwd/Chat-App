import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiChevronDown, BiSearchAlt2 } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { ChatState } from "../../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../../config/ChatLogic";

const SideDrawer = () => {
  const [search, SetSearch] = useState();
  const [SearchResult, SetSearchResult] = useState();
  const [loading, SetLoading] = useState();
  const [loadingChat, SetLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const Navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    Navigate("/");
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something ..",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      SetLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/user?search=${search}`,
        config
      );
      SetLoading(false);
      SetSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      SetLoading(false);
    }
  };
  const accessChat = async (userId) => {
    var sign = 1;
    await chats?.forEach((element) => {
      if (
        element?.users[1]._id === userId ||
        element?.users[0]._id === userId
      ) {
        setSelectedChat(element);
        sign = 0;
        return;
      }
    });
    if (sign) {
      try {
        SetLoadingChat(true);
        const config = {
          "content-type": "application/json",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/chat`,
          { userId },
          config
        );

        if (!chats?.find((c) => c.users[1]._id === data?.users[1]._id)) {
          setChats([data, ...chats]);
        }
        setSelectedChat(data);
        SetLoadingChat(false);
      } catch (error) {
        toast({
          title: "Error fetching the Chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <BiSearchAlt2 size={20} />
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"work sans"}>
          Melvin
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <IoMdNotifications m={1} fontSize={"2xl"} />
            </MenuButton>
            <Badge
              marginRight={3}
              borderRadius={"50%"}
              color={"white"}
              backgroundColor={"red"}
            >
              {notifications?.length === 0 ? null : notifications.length}
            </Badge>
            <MenuList pl={2}>
              {!notifications?.length && "No New Message"}
              {notifications?.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotifications(notifications.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : ` New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<BiChevronDown />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem> My Profile </MenuItem>
              </ProfileModel>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} p={2}>
              <Input
                placeholder="Search Name or Email"
                mr={2}
                value={search}
                onChange={(e) => SetSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              SearchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
