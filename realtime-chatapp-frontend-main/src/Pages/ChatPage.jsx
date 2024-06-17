import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Compoenents/Authentication/Miscellaneous/SideDrawer";
import MyChats from "../Compoenents/Authentication/MyChats";
import ChatBox from "../Compoenents/Authentication/ChatBox";
import { ChatState } from "../context/ChatProvider";
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
