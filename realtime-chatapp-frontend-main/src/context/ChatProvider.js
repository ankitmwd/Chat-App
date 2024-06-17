import { createContext, useEffect, useState,useContext } from "react";
import { useNavigate} from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const Navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if (!userInfo) {
            Navigate("/");
        }
    },[Navigate]);
    return (
        <ChatContext.Provider value={{ user, setUser ,selectedChat,setSelectedChat,setChats,chats,notifications, setNotifications}} >
            {children}
        </ChatContext.Provider>
    )
};
export const ChatState = () => {
    return useContext(ChatContext);
}
export default ChatProvider;