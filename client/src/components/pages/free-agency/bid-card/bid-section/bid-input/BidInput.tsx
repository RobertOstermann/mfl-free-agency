import React, { useEffect, useRef } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";

import { FreeAgencyHub } from "components/Hub";
import { useBoundStore } from "store/Store";

import styles from "./BidInput.module.scss";

export function BidInput(props: any) {
  const {
    leadBid,
    currentBid,
    updateCurrentBid,
    decreaseCurrentBid,
    increaseCurrentBid,
    submitBid,
  } = props;
  const inputRef = useRef<any>(null);

  const connection = useBoundStore((state) => state.connection);

  useEffect(() => {
    inputRef.current.value = currentBid;
  }, [currentBid]);

  const updateCurrentBidAndFocus = () => {
    const bid = parseFloat(inputRef.current.value);
    inputRef.current.value = bid.toFixed(2);
    updateCurrentBid(bid);
  };

  const optOut = () => {
    connection
      ?.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.OptOut)
      .catch((error: any) => {
        return console.error(error.toString());
      });
  };

  return (
    <React.Fragment>
      <InputGroup className={styles["bidinput-number"]}>
        <FormControl
          ref={inputRef}
          className={styles["bidinput-number-input"]}
          as="input"
          type="number"
          step="0.50"
          min={leadBid}
          placeholder="0.00"
          defaultValue={currentBid}
          onBlur={updateCurrentBidAndFocus}
        />
        <Button
          variant="outline-secondary"
          className={styles["bidinput-decrease-button"]}
          onClick={decreaseCurrentBid}
        >
          &darr;
        </Button>
        <Button
          variant="outline-secondary"
          className={styles["bidinput-increase-button"]}
          onClick={increaseCurrentBid}
        >
          &uarr;
        </Button>
      </InputGroup>
      <InputGroup className={styles["bidinput-buttons"]}>
        <Button
          variant="outline-danger"
          className={styles["bidinput-optout-button"]}
          onClick={optOut}
        >
          Opt Out
        </Button>
        <Button
          variant="outline-primary"
          className={styles["bidinput-submit-button"]}
          onClick={submitBid}
        >
          Submit
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}
