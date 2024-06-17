import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import dotenv from  'react-dotenv'
import "./App.css"
function App() {
 console.log(process.env.REACT_APP_ENDPOINT);
  return (

    <div className="App">

       <Routes>
    <Route path="/" element={<HomePage/>}></Route>
    <Route path="/chats"  element={<ChatPage/>}></Route>
    </Routes>
   </div>
  );
}

export default App;
