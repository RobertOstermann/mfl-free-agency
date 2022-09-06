import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import ChatInput from "./chat-input/ChatInput";
import ChatList from "./chat-list/ChatList";
import ChatMessageType from "./chat-message/ChatMessageType";

import styles from "./ChatBox.module.scss";

function ChatBox(props: any) {
  const { connection } = props;
  const [messages, setMessages] = useState<any>([]);
  const [messagePermissions, setMessagePermissions] = useState<any>(false);
  const latestMessages = useRef<any>(null);
  latestMessages.current = messages;
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.invoke(FreeAgencyHub.FreeAgency.Message.Invoke.GetMessages);

      connection.on(
        FreeAgencyHub.FreeAgency.Message.GrantMessagePermissions,
        () => {
          if (!mountedRef.current) return null;
          setMessagePermissions(true);
        }
      );

      connection.on(
        FreeAgencyHub.FreeAgency.Message.RevokeMessagePermissions,
        () => {
          if (!mountedRef.current) return null;
          setMessagePermissions(false);
        }
      );

      connection.on(
        FreeAgencyHub.FreeAgency.Message.ReceiveMessage,
        (sender: any, message: any) => {
          if (!mountedRef.current) return null;
          // Build message card
          const updatedMessages = [...latestMessages.current];
          updatedMessages.push({
            sender: sender,
            message: message,
            type: ChatMessageType.ReceiveMessage,
          });
          setMessages(updatedMessages);
        }
      );
      connection.on(
        FreeAgencyHub.FreeAgency.Message.ReceiveMessageDirect,
        (sender: any, message: any) => {
          if (!mountedRef.current) return null;
          // Build direct message card
          const updatedMessages = [...latestMessages.current];
          updatedMessages.push({
            sender: sender,
            message: message,
            type: ChatMessageType.ReceiveDirectMessage,
          });
          setMessages(updatedMessages);
        }
      );
      connection.on(
        FreeAgencyHub.FreeAgency.Message.ReceiveMessageInformation,
        (message: any, footer: any) => {
          if (!mountedRef.current) return null;
          // Build direct message card
          const updatedMessages = [...latestMessages.current];
          updatedMessages.push({
            sender: footer,
            message: message,
            type: ChatMessageType.ReceiveServerMessage,
          });
          setMessages(updatedMessages);
        }
      );
      connection.on(
        FreeAgencyHub.FreeAgency.Message.SendMessage,
        (sender: any, message: any) => {
          if (!mountedRef.current) return null;
          const updatedMessages = [...latestMessages.current];
          updatedMessages.push({
            sender: sender,
            message: message,
            type: ChatMessageType.SendMessage,
          });
          setMessages(updatedMessages);
        }
      );
      connection.on(
        FreeAgencyHub.FreeAgency.Message.SendMessageDirect,
        (sender: any, message: any) => {
          if (!mountedRef.current) return null;
          // Build direct sent message card
          const updatedMessages = [...latestMessages.current];
          updatedMessages.push({
            sender: sender,
            message: message,
            type: ChatMessageType.SendDirectMessage,
          });
          setMessages(updatedMessages);
        }
      );
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const cardBody = document.getElementById("chatbox-body");
    if (cardBody) cardBody.scrollTop = cardBody.scrollHeight - cardBody.clientHeight;
  };

  return (
    <Card className={styles["chatbox"]}>
      <Card.Body id="chatbox-body" className={styles["chatbox-body"]}>
        <ChatList messages={messages} />
      </Card.Body>
      <Card.Footer className={styles["chatbox-footer"]}>
        <ChatInput connection={connection} permissions={messagePermissions} />
      </Card.Footer>
    </Card>
  );
}

export default ChatBox;
