import Styles from "./game.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IGameItem, ITileSelection } from "../../redux/interfaces/GameItem";
import { IPlayer } from "../../redux/interfaces/Player";
import { ActionTypes } from "../../redux/ActionTypes";
import { GameType } from "../../redux/GameType";
import { IGameState } from "../../redux/interfaces/NewGame";

function Game() {
  let navigate = useNavigate();
  let params = useParams();
  const dispatch = useDispatch();
  const state = useSelector((x: any) => {
    return x.gameList as IGameState;
  });
  const [selectedArray, SetSelectedArray] = useState<ITileSelection[]>();
  const [gameItem, SetGameItem] = useState<IGameItem>({
    gameName: "",
    gameType: GameType.Small,
    players: [{} as IPlayer] as IPlayer[],
    completed: false,
  } as IGameItem);

  useEffect(() => {
    if (
      selectedArray?.length === 2 &&
      selectedArray[0].val === selectedArray[1].val
    ) {
      if (gameItem.validTiles === undefined) {
        gameItem.validTiles = [];
      }
      gameItem.validTiles.push(...selectedArray);
      dispatch({
        type: ActionTypes.SaveGame,
        payload: gameItem,
      });
      if (gameItem.validTiles.length === gameItem.tiles.length) {
        gameItem.completed = true;
        dispatch({
          type: ActionTypes.SaveGame,
          payload: gameItem,
        });
        navigate("/");
      }
    } else if (
      selectedArray?.length === 2 &&
      selectedArray[0].val !== selectedArray[1].val
    ) {
      nextPlayer();
    }
    if (selectedArray?.length === 2) {
      SetSelectedArray([]);
    }
  }, [selectedArray]);

  useEffect(() => {
    if (params.gameId !== undefined && params.gameId) {
      var game = state.history[state.history.length - 1];
      if (params.gameId !== "0000") {
        game = state.history.filter(
          (x) => x.id === parseInt(params.gameId!)
        )[0];
      }
      SetGameItem(game);
    } else {
      generateGame();
    }
  }, []);

  const generateGame = () => {
    SetGameItem({
      gameName: `${getGameName()}`,
      players: [
        { firstName: "Bob", lastName: "Builder", isActive: true } as IPlayer,
      ] as IPlayer[],
      gameType: GameType.Large,
      completed: false,
    } as IGameItem);
  };

  const nextPlayer = () => {
    //find the current Active Player index and +1;
    let currentPlayerIndex = gameItem.players?.findIndex(
      (x) => x.isActive === true
    );
    if (currentPlayerIndex > -1) {
      gameItem.players[currentPlayerIndex].isActive = false;
    }
    if (currentPlayerIndex === gameItem.players.length - 1) {
      currentPlayerIndex = -1;
    }

    gameItem.players[currentPlayerIndex + 1].isActive = true;
    SetGameItem((prevState) => ({
      ...prevState,
      players: gameItem.players,
    }));
    if (gameItem.id) {
      dispatch({ type: ActionTypes.SaveGame, payload: gameItem });
    }
  };
  const getGameName = () => {
    const gameNames = [
      "Signal Intelligence",
      "Micro Sports",
      "Accent Corp",
      "Mermedia",
      "Owlimited",
      "Dragonetworks",
      "Thorecords",
      "Bansheemobile",
      "Apexpoly",
      "Quadscape",
      "Signal Security",
      "Pumpkin Technologies",
      "Drift Corp",
      "Mercurtainment",
      "Lifoods",
      "Titaniumotors",
      "Riddlectronics",
      "Zeusspace",
      "Joyking",
      "Alpinetime",
      "Titanium Limited",
      "Smart Corporation",
      "Cave Acoustics",
      "Voyagetronics",
      "Hummingbirdustries",
      "Smartechnologies",
      "Sunlightning",
      "Typhoonworth",
      "Chiefwares",
      "Blueworks",
    ];
    var d = gameNames[Math.floor(Math.random() * gameNames.length) + 1];
    return d;
  };

  const addPlayer = () => {
    SetGameItem((prevState) => ({
      ...prevState,
      players: [...prevState.players, { isActive: false } as IPlayer],
    }));
  };

  const saveGame = () => {
    if (gameItem.players?.length < 1) {
    } else {
      gameItem.tiles = generateTiles(gameItem.gameType);
      dispatch({
        type: ActionTypes.NewGame,
        payload: gameItem,
      });
      navigate("/game/0000");
    }
  };

  const getNewGameForm = () => {
    return (
      <div>
        <div className={"row"}>
          <div className={Styles.inputGroup}>
            <div className={Styles.inputLabel}>Game Name</div>
            <input type="text" defaultValue={gameItem?.gameName}></input>
          </div>
        </div>
        <div className={"row"}>
          <div className={Styles.inputGroup}>
            <div className={Styles.inputLabel}>Game Size</div>
            <select
              onChange={(x) => {
                var t: any = x.target.selectedOptions[0].value;
                SetGameItem((prevState) => ({
                  ...prevState,
                  gameType: GameType[t as keyof typeof GameType],
                }));
              }}
            >
              {Object.keys(GameType).map((k) => {
                return <option>{k.toString()}</option>;
              })}
            </select>
          </div>
        </div>
        <div className={"row"}>
          <div className={Styles.groupSection}>
            <div className={`${Styles.inputGroup} ${Styles.offset}`}>
              <div className={Styles.inputLabel}>Players</div>
            </div>
            <div className={Styles.player}>
              {gameItem?.players?.map((p, i) => {
                return (
                  <div key={`player${i}`} className={Styles.groupSection}>
                    <div className={`${Styles.inputGroup} ${Styles.offset}`}>
                      <div className={`${Styles.inputLabel}`}>Player {i}</div>
                      <div
                        className={`btn btnSmall btnClose`}
                        onClick={(evt) => {
                          gameItem.players.splice(i, 1);
                          SetGameItem((prevState) => ({
                            ...prevState,
                            players: [...gameItem.players],
                          }));
                        }}
                      >
                        Remove
                      </div>
                    </div>
                    <div className={Styles.inputGroup}>
                      <div className={Styles.inputLabel}>First Name</div>
                      <input
                        type="text"
                        value={p.firstName}
                        onChange={(evt) => {
                          gameItem.players[i].firstName = evt.target.value;
                        }}
                      ></input>
                    </div>
                    <div className={Styles.inputGroup}>
                      <div className={Styles.inputLabel}>Last Name</div>
                      <input
                        type="text"
                        value={p.lastName}
                        onChange={(evt) => {
                          gameItem.players[i].lastName = evt.target.value;
                        }}
                      ></input>
                    </div>
                    <div className={Styles.inputGroup}>
                      <div className={Styles.inputLabel}>Ranking</div>
                      <input type="number" value={p.ranking}></input>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="btn btnSmall" onClick={addPlayer}>
              Add
            </div>
          </div>
        </div>
        <div className={"row"}>
          <div
            className={`btn ${
              gameItem.players?.length > 0 ? "" : "btnDisabled"
            }`}
            onClick={() => {
              saveGame();
            }}
          >
            Save
          </div>
        </div>
      </div>
    );
  };

  const getExistingGame = () => {
    const d = (
      <div className={Styles.game}>
        <div className={Styles.stats}>
          {gameItem?.players.map((p, i) => {
            return (
              <div>{`${i} ${p.firstName} ${p.lastName} ${
                p.isActive ? "*" : ""
              }`}</div>
            );
          })}
        </div>
        <div className={Styles.tileHolder}>
          {gameItem?.tiles?.map((t, i) => {
            return (
              <div
                key={t.idx}
                onClick={(ev) => {
                  var newArr = [];
                  var shouldAdd = true;
                  selectedArray?.forEach((x) => {
                    if (x === t) {
                      shouldAdd = false;
                    } else {
                      newArr.push(x);
                    }
                  });
                  if (shouldAdd) {
                    newArr.push(t);
                  }
                  SetSelectedArray(newArr);
                }}
                className={`
                 ${
                   gameItem.gameType === GameType.Small
                     ? Styles.tile4
                     : Styles.tile6
                 } 
                     ${isSelected(t) ? Styles.focus : ""}`}
              >
                {t.val}
              </div>
            );
          })}
        </div>
      </div>
    );
    return d;
  };

  const generateTiles = (gameType: GameType) => {
    let halfArray = [] as ITileSelection[];
    switch (gameType) {
      case GameType.Large:
        for (let i = 0; i < 18; i++) {
          var tileNum = (Math.floor(Math.random() * 90) + 1).toString();
          while (
            halfArray
              .map((x) => {
                return x.val;
              })
              .indexOf(tileNum) > -1
          ) {
            tileNum = (Math.floor(Math.random() * 90) + 1).toString();
          }

          halfArray.push({
            idx: halfArray.length,
            val: tileNum.toString(),
          } as ITileSelection);
        }
        break;
      case GameType.Small:
      default:
        for (let i = 0; i < 8; i++) {
          var tileNum = (Math.floor(Math.random() * 90) + 1).toString();
          while (
            halfArray
              .map((x) => {
                return x.val;
              })
              .indexOf(tileNum) > -1
          ) {
            tileNum = (Math.floor(Math.random() * 90) + 1).toString();
          }

          halfArray.push({
            idx: halfArray.length,
            val: tileNum.toString(),
          } as ITileSelection);
        }
        break;
    }
    var fullArray = halfArray;
    halfArray.flatMap((x) => {
      fullArray.push({ idx: fullArray.length, val: x.val });
    });
    return fullArray;
  };

  const isSelected = (item: ITileSelection) => {
    return (
      (selectedArray !== undefined && selectedArray?.indexOf(item) > -1) ||
      (gameItem.validTiles &&
        gameItem.validTiles
          .map((t) => {
            return JSON.stringify(t);
          })
          .indexOf(JSON.stringify(item)) > -1)
    );
  };

  return <>{params.gameId ? getExistingGame() : getNewGameForm()}</>;
}
export default Game;
