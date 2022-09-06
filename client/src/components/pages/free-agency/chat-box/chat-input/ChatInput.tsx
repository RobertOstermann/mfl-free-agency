import React, { useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";

import styles from "./ChatInput.module.scss";

function ChatInput(props: any) {
  const { connection, permissions } = props;
  const [receiver, setReceiver] = useState("Everyone");
  const [message, setMessage] = useState("");

  const onSubmit = () => {
    if (connection) {
      connection
        .invoke(FreeAgencyHub.FreeAgency.Message.SendMessage, receiver, message)
        .then(() => {
          setMessage("");
        })
        .catch(function (error: any) {
          return console.error(error.toString());
        });
    }
  };

  const updateReceiver = (event: any) => {
    const index = event.target.value;
    setReceiver(event.target[index].text);
  };

  const updateMessage = (event: any) => {
    setMessage(event.target.value);
  };

  return (
    <React.Fragment>
      <InputGroup className={styles["chatinput-receiver"]}>
        <InputGroup.Text className={styles["chatinput-receiver-text"]}>
          Send To:
        </InputGroup.Text>
        <FormControl
          as="select"
          className={styles["chatinput-receiver-button"]}
          onChange={updateReceiver}
        >
          <option value="0" defaultValue={"0"}>
            Everyone
          </option>
          {permissions && (
            <React.Fragment>
              <option value="1">Yellowstone</option>
              <option value="2">The Homelander</option>
              <option value="3">Pigeon Boys</option>
              <option value="4">Dactyls</option>
              <option value="5">ODBs</option>
              <option value="6">Storm Dynasty</option>
              <option value="7">Benchwarmers</option>
              <option value="8">Gorillas</option>
              <option value="9">Power</option>
              <option value="10">Ram</option>
            </React.Fragment>
          )}
        </FormControl>
      </InputGroup>
      <InputGroup className={styles["chatinput-message"]}>
        <FormControl
          placeholder={permissions ? "Message" : "Select your team to chat"}
          className={styles["chatinput-message-text"]}
          value={message}
          onChange={permissions ? updateMessage : undefined}
          onKeyUp={(event: any) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
        />
        {permissions && (
          <Button
            variant="outline-primary"
            className={styles["chatinput-message-button"]}
            onClick={onSubmit}
          >
            Send Message
          </Button>
        )}
      </InputGroup>
    </React.Fragment>
  );
}

export default ChatInput;
