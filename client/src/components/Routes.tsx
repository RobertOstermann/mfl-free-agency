import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import FreeAgencyPage from "components/pages/free-agency/FreeAgencyPage";
import HomePage from "components/pages/home/HomePage";
import PlayerPage from "components/pages/players/PlayerPage";
import routes from "components/RoutesHelper";
import CapTrackerPage from "./pages/cap-tracker/CapTrackerPage";

function Routes(props: any) {
  const { connection } = props;

  return (
    <main>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <HomePage {...props} connection={connection} />}
        />
        <Route
          path={routes.owner.captracker}
          render={(props) => <CapTrackerPage />}
        />
        <Route
          path={routes.owner.players}
          render={(props) => <PlayerPage {...props} connection={connection} />}
        />
        <Route
          path={routes.owner.freeagency}
          render={(props) => (
            <FreeAgencyPage {...props} connection={connection} />
          )}
        />
        <Redirect to="/" />
      </Switch>
    </main>
  );
}

export default Routes;
