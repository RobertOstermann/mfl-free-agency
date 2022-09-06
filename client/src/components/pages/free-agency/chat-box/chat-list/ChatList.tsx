import React from "react";

import ChatMessage from "../chat-message/ChatMessage";

function ChatList(props: any) {
  const { messages } = props;

  return (
    <React.Fragment>
      {messages.map((data: any, index: any) => {
        return (
          <ChatMessage
            key={index}
            message={data.message}
            sender={data.sender}
            type={data.type}
          />
        );
      })}
    </React.Fragment>
  );
}

export default ChatList;
