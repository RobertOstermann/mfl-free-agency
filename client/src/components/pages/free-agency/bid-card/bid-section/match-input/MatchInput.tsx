import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import { useBoundStore } from "store/Store";

import styles from "./MatchInput.module.scss";

export function MatchInput(props: any) {
  const { leadBid, contractYears } = props;

  const connection = useBoundStore((state) => state.connection);

  const [matchYears, setMatchYears] = useState<number>(0);
  const inputRef = useRef<any>(null);
  const yearsRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current.value = leadBid;
  }, [leadBid]);

  const optOut = () => {
    connection
      ?.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.MatchBid, false, 0)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  const matchBid = () => {
    connection
      ?.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.MatchBid, true, matchYears)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  const updateYears = (years: number) => {
    setMatchYears(years);
  };

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
        defaultValue={0}
        onChange={updateYears}
        className={styles["toggle-button-group-years"]}
      >
        {contractYears <= 2 && (
          <ToggleButton
            variant="outline-secondary"
            value={2}
            id="toggle-button-years-2"
            className={styles["toggle-button-years"]}
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
          >
            4
          </ToggleButton>
        )}
      </ToggleButtonGroup>
      <InputGroup className={styles["input-group-match"]}>
        <Button
          variant="outline-danger"
          className={styles["button-opt-out"]}
          onClick={optOut}
        >
          Opt Out
        </Button>
        <Button
          variant="outline-success"
          className={styles["button-match"]}
          onClick={() => {
            if ([2, 3, 4].includes(matchYears)) matchBid();
          }}
        >
          {[2, 3, 4].includes(matchYears) ? "Match" : "Select Years"}
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}
