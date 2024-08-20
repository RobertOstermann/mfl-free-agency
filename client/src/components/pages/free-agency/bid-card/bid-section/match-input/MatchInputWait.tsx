import React, { useEffect, useRef } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

import styles from "./MatchInputWait.module.scss";

export function MatchInputWait(props: any) {
  const { leadBid, contractYears } = props;
  const inputRef = useRef<any>(null);
  const yearsRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current.value = leadBid;
  }, [leadBid]);

  return (
    <React.Fragment>
      <InputGroup className={styles["input-group-lead-bid"]}>
        <FormControl
          ref={inputRef}
          className={styles["input-number-lead-bid"]}
          as="input"
          type="number"
          placeholder="0.00"
          defaultValue={leadBid}
          readOnly
        />
        <Button
          variant="outline-secondary"
          className={styles["button-decrease"]}
          disabled
        >
          &darr;
        </Button>
        <Button
          variant="outline-secondary"
          className={styles["button-increase"]}
          disabled
        >
          &uarr;
        </Button>
      </InputGroup>
      <ToggleButtonGroup
        ref={yearsRef}
        type="radio"
        name="years-button"
        defaultValue={contractYears}
        className={styles["toggle-button-group-years"]}
      >
        {contractYears <= 2 && (
          <ToggleButton
            variant="outline-secondary"
            value={2}
            id="toggle-button-years-2"
            className={styles["toggle-button-years"]}
            disabled
          >
            2
          </ToggleButton>
        )}
        {contractYears <= 3 && (
          <ToggleButton
            variant="outline-secondary"
            value={3}
            id="toggle-button-years-3"
            className={styles["toggle-button-years"]}
            disabled
          >
            3
          </ToggleButton>
        )}
        {contractYears <= 4 && (
          <ToggleButton
            variant="outline-secondary"
            value={4}
            id="toggle-button-years-4"
            className={styles["toggle-button-years"]}
            disabled
          >
            4
          </ToggleButton>
        )}
      </ToggleButtonGroup>
      <InputGroup className={styles["input-group-match"]}>
        <Button
          variant="outline-danger"
          className={styles["button-opt-out"]}
          disabled
        >
          Opt Out
        </Button>
        <Button
          variant="outline-success"
          className={styles["button-match"]}
          disabled
        >
          Select Years
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}
