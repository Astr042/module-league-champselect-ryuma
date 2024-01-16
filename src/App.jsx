import React, { useEffect, useState } from "react";
import Overlay from "./europe/Overlay";
import convertState from "./convertState";

function App() {
  const [globalState, setGlobalState] = useState({});
  const [config, setConfig] = useState({
    frontend: {
      scoreEnabled: true,
      spellsEnabled: true,
      coachesEnabled: true,
      blueTeam: {
        name: "Team Blue",
        score: 0,
        coach: "",
        color: "rgb(0,151,196)",
      },
      redTeam: {
        name: "Team Red",
        score: 0,
        coach: "",
        color: "rgb(222,40,70)",
      },
      patch: "",
    },
  });
  useEffect(() => {
    window.LPTE.onready(async () => {
      window.LPTE.on("module-league-state", "champselect-update", (e) => {
        console.log("e", e);
        e.data.isActive = e.isActive;
        e.data.isActive = true;
        setGlobalState(e.data);
      });

      window.LPTE.on("module-teams", "update", updateTeams);

      const themeBlue = document
        .querySelector(":root")
        .style.getPropertyValue("--blue-team");
      const themeRed = document
        .querySelector(":root")
        .style.getPropertyValue("--red-team");

      function updateTeams(e) {
        console.log("UPDATE TEAMS");
        setConfig({
          frontend: {
            ...config.frontend,
            blueTeam: {
              name: e.teams.blueTeam.name,
              score: e.teams.blueTeam.score,
              coach: e.teams.blueTeam.coach,
            },
            redTeam: {
              name: e.teams.redTeam.name,
              score: e.teams.redTeam.score,
              coach: e.teams.redTeam.coach,
            },
          },
        });
        if (e.teams.blueTeam.color !== "#000000") {
          document
            .querySelector(":root")
            .style.setProperty("--blue-team", e.teams.blueTeam.color);
        } else {
          document
            .querySelector(":root")
            .style.setProperty("--blue-team", themeBlue);
        }
        if (e.teams.redTeam.color !== "#000000") {
          document
            .querySelector(":root")
            .style.setProperty("--red-team", e.teams.redTeam.color);
        } else {
          document
            .querySelector(":root")
            .style.setProperty("--red-team", themeRed);
        }
      }

      const teams = await window.LPTE.request({
        meta: {
          namespace: "module-teams",
          type: "request-current",
          version: 1,
        },
      });

      if (teams === undefined) return;
      updateTeams(teams);
    });
  }, []);

  return (
    <div className="App">
      <Overlay state={convertState(globalState)} config={config} />
    </div>
  );
}

export default App;
