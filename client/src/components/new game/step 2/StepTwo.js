import React, { useEffect } from "react";
import { useNewGame, usePlayers } from "../../../contexts/DataContext";
import {
  Box,
  Typography,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Flip from "react-reveal/Flip";
import socket from "../../../socket";

const useStyles = makeStyles((theme) =>
  createStyles({
    item: {
      padding: 0,
    },
  }),
);

const StepTwo = () => {
  const [newGame] = useNewGame();
  const [players, setPlayers] = usePlayers();

  const classes = useStyles();

  useEffect(() => {
    // User joins the room
    let room = "match-" + newGame.matchId;
    let matchId = newGame.matchId;
    let token = localStorage.getItem("token");
    let data = {
      room: room,
      matchId: matchId,
      token: token,
    };

    if (newGame.matchId !== "") {
      console.log("socket-emit-playerjoined");
      socket.emit("join-match", data);
    }
    //Shows players that have joined so far in game setup (Will be displayed in StepTwo.js)
    socket.on("update-players", (match) => {
      console.log("socket-on-add-players");
      setPlayers(match.players);
    });
  }, [newGame]);

  const showPlayers = () => {
    return players.map((player, i) => {
      return (
        <ListItem className={classes.item} key={i}>
          <Flip left>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={player.name} />
          </Flip>
        </ListItem>
      );
    });
  };

  return (
    <>
      <Box height={200}>
        <Typography variant="h3">Players Joined:</Typography>
        <List>{showPlayers()}</List>
      </Box>
    </>
  );
};

export default StepTwo;
