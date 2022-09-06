import React, { useEffect, useRef, useState } from "react";

import { FreeAgencyHub } from "components/Hub";
import BidInformation from "./bid-information/BidInformation";
import BidInput from "./bid-input/BidInput";
import BidInputOptIn from "./bid-input/BidInputOptIn";
import BidSectionState from "./BidSectionState";
import CommissionerInput from "./commissioner-input/CommissionerInput";
import FinalBidInput from "./final-bid-input/FinalBidInput";
import GuestInput from "./guest-input/GuestInput";
import MatchInput from "./match-input/MatchInput";
import MatchInputWait from "./match-input/MatchInputWait";

// import styles from "./BidSection.module.scss";

function BidSection(props: any) {
  const { connection } = props;
  const [state, setState] = useState(BidSectionState.Guest);
  const [leadBid, setLeadBid] = useState("7.00");
  const [leadTeam, setLeadTeam] = useState(null);
  const [currentBid, setCurrentBid] = useState("7.00");
  const [contractYears, setContractYears] = useState<any>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (connection) {
      connection.on(FreeAgencyHub.LoginStatus, (loggedIn: any) => {
        if (!mountedRef.current) return null;
        if (loggedIn) setState(BidSectionState.User.Bid); // Wait
        if (!loggedIn) setState(BidSectionState.Guest);
      });

      connection.on(FreeAgencyHub.FreeAgency.Player.SetPlayer, (player: any) => {
        if (!mountedRef.current) return null;
        setContractYears(player.contractYears);
      });

      connection.on(FreeAgencyHub.FreeAgency.Bid.GrantBidPermissions, () => {
        if (!mountedRef.current) return null;
        setState(BidSectionState.User.Bid);
        connection.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetBid);
      });

      connection.on(
        FreeAgencyHub.FreeAgency.Bid.GrantFinalBidPermissions,
        () => {
          if (!mountedRef.current) return null;
          setState(BidSectionState.User.FinalBid);
          setCurrentBid(leadBid);
          connection.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetBid);
        }
      );

      connection.on(FreeAgencyHub.FreeAgency.Bid.RevokeBidPermissions, () => {
        if (!mountedRef.current) return null;
        setState(BidSectionState.User.Wait);
        connection.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetBid);
      });

      connection.on(FreeAgencyHub.FreeAgency.Bid.GrantMatchPermissions, () => {
        if (!mountedRef.current) return null;
        setState(BidSectionState.User.Match);
        connection.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetBid);
      });

      connection.on(FreeAgencyHub.FreeAgency.Bid.RevokeMatchPermissions, () => {
        if (!mountedRef.current) return null;
        setState(BidSectionState.User.MatchWait);
        connection.invoke(FreeAgencyHub.FreeAgency.Bid.Invoke.GetBid);
      });

      connection.on(
        FreeAgencyHub.FreeAgency.Bid.ReceiveBid,
        (team: any, bid: any, exact = false) => {
          if (!mountedRef.current) return null;
          if (exact) {
            setLeadBid(bid.toFixed(2));
            setLeadTeam(team);
          } else {
            setLeadBid(bid.toFixed(2));
            setLeadTeam(team);
            const updatedBidNumber = Math.floor(parseFloat(bid) * 2) / 2;
            const updatedBid = (updatedBidNumber + 0.5).toFixed(2);
            setCurrentBid(updatedBid);
          }
        }
      );

      connection.on(
        FreeAgencyHub.FreeAgency.Bid.ReceiveFinalBid,
        (team: any, bid: any, years: any) => {
          if (!mountedRef.current) return null;
          setLeadBid(bid.toFixed(2));
          setLeadTeam(team);
          setContractYears(years);
        }
      );

      connection.on(FreeAgencyHub.FreeAgency.Bid.OptIn, () => {
        if (!mountedRef.current) return null;
        setState(BidSectionState.User.Bid);
      });

      connection.on(FreeAgencyHub.FreeAgency.Bid.OptOut, () => {
        if (!mountedRef.current) return null;
        setState(BidSectionState.User.OptOut);
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connection, leadBid]);

  const updateCurrentBid = (bid: any) => {
    if (parseFloat(bid) >= parseFloat(leadBid)) setCurrentBid(bid.toFixed(2));
  };

  const decreaseCurrentBid = () => {
    const bid = ((Math.ceil(parseFloat(currentBid) * 2) / 2) - 0.5).toFixed(2);
    if (parseFloat(bid) >= parseFloat(leadBid)) setCurrentBid(bid);
  };

  const increaseCurrentBid = () => {
    const bid = ((Math.ceil(parseFloat(currentBid) * 2) / 2) + 0.5).toFixed(2);
    setCurrentBid(bid);
  };

  const submitBid = () => {
    if (parseFloat(currentBid) > parseFloat(leadBid)) {
      connection
        .invoke(
          FreeAgencyHub.FreeAgency.Bid.Invoke.SendBid,
          parseFloat(currentBid)
        )
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const updateContractYears = (years: any) => {
    setContractYears(parseInt(years));
  };

  const submitFinalBid = () => {
    if ([2, 3, 4].includes(parseInt(contractYears))) {
      connection
        .invoke(
          FreeAgencyHub.FreeAgency.Bid.Invoke.SendFinalBid,
          parseFloat(currentBid),
          parseInt(contractYears)
        )
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  let Output = () => <React.Fragment />;

  if (state === BidSectionState.Guest) {
    Output = () => <GuestInput leadBid={leadBid} />;
  }

  // if (state === BidSectionState.User.Wait)

  if (state === BidSectionState.User.Bid) {
    Output = () => (
      <BidInput
        connection={connection}
        leadBid={leadBid}
        currentBid={currentBid}
        updateCurrentBid={updateCurrentBid}
        decreaseCurrentBid={decreaseCurrentBid}
        increaseCurrentBid={increaseCurrentBid}
        submitBid={submitBid}
      />
    );
  }

  if (state === BidSectionState.User.FinalBid) {
    Output = () => (
      <FinalBidInput
        leadBid={leadBid}
        currentBid={currentBid}
        contractYears={contractYears}
        updateCurrentBid={updateCurrentBid}
        decreaseCurrentBid={decreaseCurrentBid}
        increaseCurrentBid={increaseCurrentBid}
        updateContractYears={updateContractYears}
        submitFinalBid={submitFinalBid}
      />
    );
  }

  if (state === BidSectionState.User.OptOut) {
    Output = () => <BidInputOptIn connection={connection} leadBid={leadBid} />;
  }

  if (state === BidSectionState.User.MatchWait) {
    Output = () => (
      <MatchInputWait leadBid={leadBid} contractYears={contractYears} />
    );
  }

  if (state === BidSectionState.User.Match) {
    Output = () => (
      <MatchInput
        connection={connection}
        leadBid={leadBid}
        contractYears={contractYears}
      />
    );
  }

  return (
    <React.Fragment>
      <BidInformation
        leadBid={leadBid}
        leadTeam={leadTeam}
        contractYears={contractYears}
      />
      <Output />
      <CommissionerInput connection={connection} />
    </React.Fragment>
  );
}

export default BidSection;
