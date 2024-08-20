import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { Outlet } from "@tanstack/react-router";

import { FreeAgencyHub } from "components/Hub";
import { NavBar } from "components/navbar/NavBar";
import { Api } from "./api/Api";
import { Footer } from "./components/footer/Footer";
import { useBoundStore } from "./store/Store";

import "MFLManager.scss";

export function MFLManager() {
  const [, setCookie, removeCookie] = useCookies(["TeamCookie"]);

  const connection = useBoundStore((state) => state.connection);
  const setConnection = useBoundStore((state) => state.setConnection);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${Api.route}/hubs/freeagency`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
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
          {connected && <Outlet />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
