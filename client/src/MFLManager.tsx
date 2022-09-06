import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { FreeAgencyHub } from "components/Hub";
import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import Routes from "./components/Routes";

import "MFLManager.scss";

function MFLManager() {
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [connected, setConnected] = useState(false);
  const [, setCookie, removeCookie] = useCookies(["TeamCookie"]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${window.location.origin}/hubs/freeagency`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection && connection.state === HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => {
          setConnected(true);
          connection.invoke(FreeAgencyHub.Invoke.InitializeServer);
          connection.invoke(FreeAgencyHub.Invoke.GetCookie);

          connection.on(FreeAgencyHub.SetCookie, (team: any) => {
            setCookie("TeamCookie", team, { path: "/" });
          });

          connection.on(FreeAgencyHub.RemoveCookie, () => {
            removeCookie("TeamCookie", { path: "/" });
          });
        })
        .catch((error: any) => console.error("Connection failed: ", error));
    }
  }, [connection, setCookie, removeCookie]);

  return (
    <div className="page">
      <div className="content">
        <NavBar />
        <div className="MFL-Manager">
          {connected && <Routes connection={connection} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MFLManager;
