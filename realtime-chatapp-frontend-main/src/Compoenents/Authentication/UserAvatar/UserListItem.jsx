import { Avatar, Box, Text } from "@chakra-ui/react";
import { color } from "framer-motion";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg="#E8E8E8"
      width={"100%"}
      display="flex"
      alignItems={"center"}
      color={"black"}
      paddingX={3}
      paddingY={2}
      marginY={2}
      borderRadius={"lg"}
      _hover={{
        backgroundColor: "#38B2AC",
        color: "white",
      }}
    >
      <Avatar
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email :</b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
