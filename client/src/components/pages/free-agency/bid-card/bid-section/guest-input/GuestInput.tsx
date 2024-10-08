import React from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "@tanstack/react-router";

import styles from "./GuestInput.module.scss";

export function GuestInput(props: any) {
  const { leadBid } = props;
  const navigate = useNavigate();

  const selectTeam = () => {
    navigate({ to: "/" });
  };

  return (
    <React.Fragment>
      <InputGroup className={styles["number-input-group"]}>
        <FormControl
          className={styles["number-input"]}
          as="input"
          type="number"
          placeholder="0.00"
          defaultValue={leadBid}
          readOnly
        />
      </InputGroup>
      <InputGroup className={styles["button-input-group"]}>
        <Button
          variant="outline-secondary"
          className={styles["select-team-button"]}
          onClick={selectTeam}
        >
          Select Team
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}
