import React, { useEffect, useState } from 'react';

import Header from './components/Header';
import { socket } from './utils/socket';

function App() {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [nameExists, setNameExists] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  const submitHandler = (e) => {
    e.preventDefault();

    if (messageInput === '' || !messageInput) {
      setMessageInput('');
      return;
    }

    const message = {
      text: messageInput,
      type: 'message--sent',
      user: name,
    };

    setMessages([...messages, message]);

    // Send the message to the server
    socket.emit('chatMessage', message);

    setMessageInput('');
  };

  const nameSubmitHandler = (e) => {
    e.preventDefault();
    setNameExists(true);

    socket.emit('userJoined', name);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to sockets!');
      socket.on('connectedUsers', (num) => {
        setConnectedUsers(num);
      });
    });

    socket.on('message', (receivedMessage) => {
      setMessages([
        ...messages,
        { ...receivedMessage, type: 'message--recieved' },
      ]);
    });

    socket.on('userJoined', (name) => {
      console.log(name);
      setMessages([
        ...messages,
        { text: `${name.name} has joined the chat`, type: name.type },
      ]);
    });
  }, [messages]);

  return (
    <>
      <main className="app-container">
        <Header users={connectedUsers} />
        {!nameExists ? (
          <>
            <form className="name-input" onSubmit={nameSubmitHandler}>
              <p className="name-input__title">
                Please enter your name to join the chat
              </p>
              <input
                className="name-input__input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button className="name-input__button" type="submit">
                Join
              </button>
            </form>
          </>
        ) : (
          <>
            <ul className="message-container">
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <li key={index} className={`message ${message.type}`}>
                    <span className="messsage message__user">
                      {message.user ? message.user : ''}
                    </span>
                    {message.text}
                  </li>
                </React.Fragment>
              ))}
            </ul>

            <form className="chat-input" onSubmit={submitHandler}>
              <input
                className="chat-input__input"
                type="text"
                placeholder="Type a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button className="chat-input__button" type="submit">
                Send
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}

export default App;
