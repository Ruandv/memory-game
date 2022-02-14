import Styles from "./game.module.scss";
import InputGroup from "../../controls/inputGroup/inputGroup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IGameItem } from "../../interfaces/IGameItem";
import { ITileSelection } from "../../interfaces/ITileSelection";
import { IPlayer } from "../../interfaces/IPlayer";
import { GameType } from "../../enums/GameType";
import FireBaseGameService from "../../services/fb_GameService";
import StorageService from "../../services/storageService";

function Game() {
  const navigate = useNavigate();
  const params = useParams();

  const [selectedArray, SetSelectedArray] = useState<ITileSelection[]>();
  const [gameItem, SetGameItem] = useState<IGameItem>({
    gameName: "",
    gameType: undefined,
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

      if (gameItem.validTiles.length === gameItem.tiles.length) {
        gameItem.completed = true;
        FireBaseGameService.createSave(gameItem, deviceUniqueId);
        navigate("/");
      }
    } else if (
      selectedArray?.length === 2 &&
      selectedArray[0].val !== selectedArray[1].val
    ) {
      nextPlayer();
    }
    if (selectedArray?.length === 2) {
      const intervalId = setInterval(() => {
        console.log("Saving game again");
        FireBaseGameService.createSave(gameItem, deviceUniqueId);
        SetSelectedArray([]);
        clearInterval(intervalId);
      }, 500);
    }
  }, [selectedArray]);
  const service = StorageService.getInstance();
  let deviceUniqueId: string;
  deviceUniqueId = service.getValue("UniqueId", true);

  useEffect(() => {
    let games: IGameItem[] = [];
    const getGamesAsync = async () => {
      games = await FireBaseGameService.getAll(deviceUniqueId);
      if (params.gameId !== undefined && params.gameId) {
        const game = games.filter((x) => {
          if (!x) {
            return false;
          }
          return x.id === params.gameId;
        });
        SetGameItem(game[0]);
      } else {
        generateGame(deviceUniqueId);
      }
    };
    getGamesAsync();
  }, []);

  const generateGame = (deviceUniqueId: string) => {
    SetGameItem({
      id: (crypto as any).randomUUID(),
      gameName: `${getGameName()}`,
      deviceUniqueId,
      players: [
        { firstName: "Bob", lastName: "Builder", isActive: true } as IPlayer,
      ] as IPlayer[],
      gameType: undefined,
      completed: false,
    } as IGameItem);
  };

  const nextPlayer = () => {
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
      FireBaseGameService.createSave(gameItem, deviceUniqueId);
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
    const d = gameNames[Math.floor(Math.random() * gameNames.length) + 1];
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
      gameItem.tiles = generateTiles(gameItem.gameType!);
      FireBaseGameService.createSave(gameItem, deviceUniqueId);
      navigate(`/game/${gameItem.id}`);
    }
  };
  const firstNameProps = {
    labelText: "First name",
    defaultValue: "",
    onChange: (evt: any) => {},
  };

  const lastNameProps = {
    labelText: "Last name",
    defaultValue: "",
    onChange: (evt: any) => {},
  };

  const gameNameProps = {
    labelText: "Game Name",
    defaultValue: gameItem?.gameName,
    onChange: (x: any) => {
      SetGameItem((prevState) => ({
        ...prevState,
        gameName: x.target.value,
      }));
    },
  };
  const getNewGameForm = () => {
    return (
      <div className={`${Styles.newGame}`}>
        <div className={"row"}>
          <InputGroup {...gameNameProps} />
        </div>
        <div className={"row"}>
          <div className={Styles.inputGroup}>
            <div className={Styles.inputLabel}>Game Size</div>
            <select
              onChange={(x) => {
                const t: any = x.target.selectedOptions[0].value;
                SetGameItem((prevState) => ({
                  ...prevState,
                  gameType: GameType[t as keyof typeof GameType],
                }));
              }}
            >
              <option>Select a size</option>;
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
                firstNameProps.defaultValue = p.firstName;
                firstNameProps.onChange = (evt) => {
                  gameItem.players[i].firstName = evt.target.value;
                };

                lastNameProps.defaultValue = p.lastName;
                lastNameProps.onChange = (evt) => {
                  gameItem.players[i].lastName = evt.target.value;
                };

                return (
                  <div key={`player${i}`} className={Styles.groupSection}>
                    <div className={`${Styles.inputGroup} ${Styles.offset}`}>
                      <div className={`${Styles.inputLabel}`}>Player {i}</div>
                      <div
                        className={"btn btnSmall btnClose"}
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
                    <InputGroup {...firstNameProps} />
                    <InputGroup {...lastNameProps} />
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
              gameItem.players?.length > 0 && gameItem.gameType !== undefined
                ? ""
                : "btnDisabled"
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
    const existingGame = (
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
                  const newArr = [];
                  let shouldAdd = true;
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
                     ${isSelected(t) ? Styles.focus + " " + Styles.spin : ""}`}
              >
                {isSelected(t) ? t.val : ""}
              </div>
            );
          })}
        </div>
      </div>
    );
    return existingGame;
  };

  const generateTiles = (gameType: GameType) => {
    const halfArray = [] as ITileSelection[];
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
          halfArray.push({
            idx: halfArray.length,
            val: tileNum.toString(),
          } as ITileSelection);
        }
        break;
    }
    const fullArray = shuffle(halfArray);
    return fullArray;
  };

  function shuffle(array: ITileSelection[]) {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const isSelected = (item: ITileSelection) => {
    return (
      (selectedArray !== undefined && selectedArray?.indexOf(item) > -1) ||
      (gameItem.validTiles &&
        gameItem.validTiles
          .map((t: ITileSelection) => {
            return JSON.stringify({ val: t.val, idx: t.idx });
          })
          .indexOf(JSON.stringify({ val: item.val, idx: item.idx })) > -1)
    );
  };

  return <>{params.gameId ? getExistingGame() : getNewGameForm()}</>;
}
export default Game;
