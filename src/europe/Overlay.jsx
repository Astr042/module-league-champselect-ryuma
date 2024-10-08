import React from "react";
import cx from "classnames";
import Pick from "./Pick";

import css from "./style/index.less";
import Ban from "./Ban";

export default class Overlay extends React.Component {
  state = {
    currentAnimationState: css.TheAbsoluteVoid,
    openingAnimationPlayed: false,
  };

  playOpeningAnimation() {
    this.setState({ openingAnimationPlayed: true });
    setTimeout(() => {
      this.setState({ currentAnimationState: css.AnimationHidden });

      setTimeout(() => {
        this.setState({
          currentAnimationState:
            css.AnimationTimer + " " + css.AnimationBansPick,
        });

        setTimeout(() => {
          this.setState({
            currentAnimationState:
              css.AnimationBansPick + " " + css.AnimationBansPickOnly,
          });

          setTimeout(() => {
            this.setState({ currentAnimationState: css.AnimationPigs });
          }, 1000);
        }, 1450);
      }, 700);
    }, 500);
  }

  render() {
    const { state, config } = this.props;

    if (state.isActive && !this.state.openingAnimationPlayed) {
      this.playOpeningAnimation();
    }

    if (!state.isActive && this.state.openingAnimationPlayed) {
      this.setState({ openingAnimationPlayed: false });
      this.setState({ currentAnimationState: css.TheAbsoluteVoid });
    }

    const renderBans = (teamState) => {
      const list = teamState.bans.map((ban) => <Ban {...ban} />);
      list.splice(3, 0, <div className={css.Spacing} />);
      return <div className={cx(css.BansBox)}>{list}</div>;
    };

    const renderTeam = (teamName, teamConfig, teamState) => {
      return (
        <div className={cx(css.Team, teamName)}>
          <div className={cx(css.Picks)}>
            {teamState.picks.map((pick) => (
              <Pick
                config={this.props.config}
                {...pick}
                showSummoners={state.showSummoners}
              />
            ))}
          </div>
          <div className={css.BansWrapper}>
            <div
              className={cx(css.Bans, {
                [css.WithScore]: config.frontend.scoreEnabled,
              })}
            >
              {teamName === css.TeamBlue && config.frontend.scoreEnabled && (
                <div className={css.TeamScore}>{teamConfig.score}</div>
              )}
              {teamName === css.TeamRed && renderBans(teamState)}
              <div
                className={cx(css.TeamName, {
                  [css.WithoutCoaches]: !config.frontend.coachesEnabled,
                })}
              >
                <div className={css.CoachName}>
                  {teamConfig.coach?.includes(",") ? "Coaches: " : "Coach: "}
                  {teamConfig.coach}
                </div>
                <div style={{ marginTop: "-5px" }}>{teamConfig.name}</div>
              </div>
              {teamName === css.TeamBlue && renderBans(teamState)}
              {teamName === css.TeamRed && config.frontend.scoreEnabled && (
                <div className={css.TeamScore}>{teamConfig.score}</div>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        className={cx(
          css.Overlay,
          css.Europe,
          this.state.currentAnimationState
        )}
        style={{
          "--color-red": config.frontend.redTeam.color,
          "--color-blue": config.frontend.blueTeam.color,
        }}
      >
        {Object.keys(state).length === 0 && (
          <div className={cx(css.infoBox)}>
            Not connected to backend service!
          </div>
        )}
        {Object.keys(state).length !== 0 && (
          <div className={cx(css.ChampSelect)}>
            {/* !state.leagueConnected && <div className={cx(css.infoBox)}>Not connected to client!</div> */}
            <div className={cx(css.MiddleBox)}>
              <div className={cx(css.Logo)}>
                <img src="/pages/op-plugin-theming/active/logo.png" alt="" />
              </div>
              <div className={cx(css.Patch)}>{state.state}</div>
              <div
                className={cx(css.Timer, {
                  [`${css.Red} ${css.Blue}`]:
                    !state.blueTeam.isActive && !state.redTeam.isActive,
                  [css.Blue]: state.blueTeam.isActive,
                  [css.Red]: state.redTeam.isActive,
                })}
              >
                <div className={cx(css.Background, css.Blue)} />
                <div className={cx(css.Background, css.Red)} />
                {state.timer < 100 && (
                  <div className={cx(css.TimerChars)}>
                    {state.timer
                      .toString()
                      .split("")
                      .map((char) => (
                        <div className={cx(css.TimerChar)}>{char}</div>
                      ))}
                  </div>
                )}
                {state.timer >= 100 && (
                  <div className={cx(css.TimerChars)}>{state.timer}</div>
                )}
              </div>
            </div>
            {renderTeam(css.TeamBlue, config.frontend.blueTeam, state.blueTeam)}
            {renderTeam(css.TeamRed, config.frontend.redTeam, state.redTeam)}
          </div>
        )}
      </div>
    );
  }
}
