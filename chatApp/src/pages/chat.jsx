import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuSend } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";

const socket = io("http://localhost:3000");

const Chat = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const notify = (message) => toast.error(message);
  const [friends, setfiends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setuser] = useState();
  const [senderId, setsenderId] = useState();
  const [userName, setUerName] = useState();
  const [chat, setchat] = useState(false);
  const [tempchat, setTempchat] = useState(true);
  const loggedInUser = localStorage.getItem("loggedInUser");
  const currenUser = localStorage.getItem("currentUser");
  const currentUserName = localStorage.getItem("userName");
  const newcurrenUser = Number(currenUser);
  const messagesEndRef = useRef(null);
  const [notification, setNotification] = useState({});
 // const [isHover, setIsHovered] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await verifyUser();
      await getUser();
      newMessages();
      if (currenUser) {
        setTempchat(false);
        const message = localStorage.getItem("messages");
        setuser(newcurrenUser);
        setUerName(currentUserName);
        const newmessage = JSON.parse(message);
        setMessages(newmessage);
        setchat(true);
      
      }
    };

    initialize();
    return () => {
      socket.off("chat message");
    };
  }, []);

  // Verify user
  const verifyUser = async () => {
    try {
      if (!token) {
        return navigate("/Not Found");
      }
      const response = await fetch("http://localhost:3000/api/verifyuser", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        notify(responseData.message);
        return;
      }
      const userId = await responseData.id;
      socket.emit("register", userId);
      setsenderId(userId);
    } catch (error) {
      notify(error);
      console.log(error);
    }
  };

  // Listing new messages
  let newnotifiation = {};
  const newMessages = () => {
      socket.on("chat message", (text) => {
      if (text.receiverid === senderId) {
        const sender = text.senderid;
     //   const senderName = friends.find((user) => user.id === senderId)?.userName || "unknown";
        if (!newnotifiation[sender]) {
          newnotifiation[sender] = 0;
        }
        newnotifiation[sender] += 1;
        //alert(notification)
        setNotification(newnotifiation);
      }

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, text];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });
  };

 

  // Getting all users
  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/alluser", {
        method: "get",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        return notify(responseData.message);
      }
      setfiends(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Storing messages in database
  const storeMessages = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/storeMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          senderId: senderId,
          reciepenId: user,
        }),
      });
      if (!response.ok) {
        console.log("not stored");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sending messages to other user
  const handleSend = () => {
    if (input.trim()) {
      storeMessages();
      const message = { message: input, senderid: senderId, receiverid: user };
      const updatemesage = [...messages, message];
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("chat message", { message: input, senderid: senderId, receiverid: user });
      localStorage.setItem("messages", JSON.stringify(updatemesage));
      setInput("");
    }
  };

  // Getting user messages from database
  const selectUser = async (reciepenId, userName) => {
    try {
      const url = `http://localhost:3000/api/retriveMessages?receiverId=${senderId}&senderId=${reciepenId}`;
      const response = await fetch(url, {
        method: "get",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      const messages = responseData.data;
      setMessages(messages);
      if (!response.ok) {
        console.log(responseData);
      }
      setuser(reciepenId);
      setTempchat(false);
      setchat(true);
      setUerName(userName);
      setNotification((prev) => ({ ...prev, [reciepenId]: 0 }));
      localStorage.setItem("currentUser", reciepenId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("messages", JSON.stringify(messages));
    } catch (error) {
      console.log(error);
    }
  };

  // Handling logout
  const haldleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:flex-row h-screen bg-black text-white">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 h-full p-4 border-r border-gray-600 overflow-y-auto bg-gray-800">
          <div className="flex items-center justify-between cursor-pointer p-1 mb-5 bg-gray-700 text-gray-300 rounded-lg">
            <div className="flex items-center">
              <img
                src="../src/assets/profilePhoto2.svg"
                alt="Logo"
                className="w-16 h-8 mr-3"
              />
              <h1 className="text-lg md:text-2xl">
                {loggedInUser}
                <sub className="text-gray-500 text-xs md:text-sm text-blue-600">(You)</sub>
              </h1>
            </div>
            <button
              onClick={haldleLogout}
              className="text-white bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-1 md:px-4 md:py-2 transition duration-200"
            >
              Log out
            </button>
          </div>
          <hr />
          <h1 className="mt-4 text-lg md:text-xl text-white">All users:</h1>
          <div className="mt-4 space-y-4">
            {friends.map((user, index) => (
              <div
                key={index}
                onClick={() => selectUser(user.id, user.userName)}
                className="flex item-center justify-between cursor-pointer flex items-center p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                <div className="flex border-gray-300 rounded-lg px-3 pl-0 text-lg md:text-xl">
                  <img
                    src="../src/assets/profilePhoto2.svg"
                    alt="Logo"
                    className="w-16 h-8"
                  />
                  {user.userName}
                </div>
                {chat ? "" : notification[user.id] > 0 && (
                  <div className="box -shadow text-green-500 mr-6 font-bold shadow-lg">{notification[user.id]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col p-4 bg-gray-900 ${tempchat ? 'hidden' : 'block'}`}>
          {chat && (
            <>
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-600 mb-4">
                <div className="flex items-center">
                  <button
                    title="back"
                    onClick={() => {
                      setchat(false);
                      setTempchat(true);
                    }}
                    className="mr-2"
                  >
                    <IoMdArrowRoundBack className="text-white" />
                  </button>
                  <img
                    src="../src/assets/profilePhoto2.svg"
                    alt="Logo"
                    className="w-20 h-10"
                  />
                  <h1 className="text-xl font-semibold text-white">{userName}</h1>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-800 rounded-lg mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.senderid === senderId ? `justify-end` : "justify-start"} my-2`}
                  >
                    <div                    
                      className={`p-2 rounded-lg max-w-xs ${message.senderid === senderId ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"}`}
                    >
                      {message.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Area */}
              <div className="flex p-4 border-t border-gray-600">
                <input
                  type="text"
                  //value={input}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {e.preventDefault();
                    setInput(e.target.value)}}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                />
                <button
                  title="send message"
                  onClick={handleSend}
                  className="ml-2 p-2 bg-green-600 rounded-lg hover:bg-green-500"
                >
                  <LuSend />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
