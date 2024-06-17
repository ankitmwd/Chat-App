import { Box } from "@chakra-ui/react";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { CloseIcon } from "@chakra-ui/icons";
const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display={"flex"}
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={14}
      background="purple"
      color={"white"}
      cursor={"pointer"}
      onClick={handleFunction}
      alignItems={"center"}
    >
      {user.name}
      <AiOutlineClose size={15} />
    </Box>
  );
};

export default UserBadgeItem;
