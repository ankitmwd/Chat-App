// import React from "react";
import * as React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip, border } from "@chakra-ui/react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./style.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  console.log(messages);
  return (
    <ScrollableFeed>
      {messages?.map((m, i) => (
        <div
          style={{
            display: "flex",
          }}
          key={m._id}
          className="messages"
        >
          <span
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "fit-content",
              marginLeft: isSameSenderMargin(messages, m, i, user._id),

              marginTop: isSameUser(messages, m, i, user._id) ? "3px" : "10px",
            }}
          >
            {m.content}
          </span>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) &&
            m.sender._id !== user._id && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  size={"sm"}
                  cursor={"pointer"}
                  name={m.sender.name}
                  src={m.sender.pic}
                ></Avatar>
              </Tooltip>
            )}
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
