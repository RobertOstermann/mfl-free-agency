import React from "react";
import { Card } from "react-bootstrap";

import styles from "./ChatMessage.module.scss";

export function ChatMessage(props: any) {
  const { message, sender, type } = props;

  return (
    <Card className={styles[type.card]}>
      <Card.Body className={styles[type.body]}>
        <Card.Text className={styles[type.text]}>{message}</Card.Text>
      </Card.Body>
      <Card.Footer className={styles[type.footer]}>{sender}</Card.Footer>
    </Card>
  );
}
