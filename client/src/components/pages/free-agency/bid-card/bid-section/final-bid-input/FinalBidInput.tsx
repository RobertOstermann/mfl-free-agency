import React, { useEffect, useRef } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

import styles from "./FinalBidInput.module.scss";

export function FinalBidInput(props: any) {
  const {
    leadBid,
    currentBid,
    contractYears,
    updateCurrentBid,
    decreaseCurrentBid,
    increaseCurrentBid,
    updateContractYears,
    submitFinalBid,
  } = props;
  const inputRef = useRef<any>(null);
  const yearsRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current.value = currentBid;
  }, [currentBid]);

  const updateCurrentBidAndFocus = () => {
    const bid = parseFloat(inputRef.current.value);
    inputRef.current.value = bid.toFixed(2);
    updateCurrentBid(bid);
  };

  const updateYears = (years: any) => {
    if (parseInt(years) !== parseInt(contractYears)) {
      updateContractYears(years);
    }
  };

  return (
    <React.Fragment>
      <InputGroup className={styles["finalbidinput-number"]}>
        <FormControl
          ref={inputRef}
          className={styles["finalbidinput-number-input"]}
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
          className={styles["finalbidinput-decrease-button"]}
          onClick={decreaseCurrentBid}
        >
          &darr;
        </Button>
        <Button
          variant="outline-secondary"
          className={styles["finalbidinput-increase-button"]}
          onClick={increaseCurrentBid}
        >
          &uarr;
        </Button>
      </InputGroup>
      <ToggleButtonGroup
        ref={yearsRef}
        type="radio"
        name="years-button"
        defaultValue={contractYears}
        onChange={updateYears}
        className={styles["finalbidinput-years"]}
      >
        <ToggleButton
          variant="outline-secondary"
          value={2}
          id="finalbidinput-years-2"
          className={styles["finalbidinput-years-button"]}
        >
          2
        </ToggleButton>
        <ToggleButton
          variant="outline-secondary"
          value={3}
          id="finalbidinput-years-3"
          className={styles["finalbidinput-years-button"]}
        >
          3
        </ToggleButton>
        <ToggleButton
          variant="outline-secondary"
          value={4}
          id="finalbidinput-years-4"
          className={styles["finalbidinput-years-button"]}
        >
          4
        </ToggleButton>
      </ToggleButtonGroup>
      <InputGroup className={styles["finalbidinput-buttons"]}>
        <Button
          variant="outline-primary"
          className={styles["finalbidinput-submit-button"]}
          onClick={() => {
            if ([2, 3, 4].includes(contractYears)) submitFinalBid();
          }}
        >
          {[2, 3, 4].includes(contractYears)
            ? "Submit Final Bid"
            : "Select Contract Length"}
        </Button>
      </InputGroup>
    </React.Fragment>
  );
}
