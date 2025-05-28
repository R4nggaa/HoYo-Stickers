import {
  ImageList,
  ImageListItem,
  Popover,
  Button,
  TextField,
} from "@mui/material";
import { useState, useMemo } from "react";
import giCharacters from "../gi-char.json";
import hsrCharacters from "../hsr-char.json";
import hi3Characters from "../hi3-char.json";
import zzzCharacters from "../zzz-char.json";
import totCharacters from "../tot-char.json";


export default function Picker({ setCharacter }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("GI");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "picker" : undefined;

    const characterMap = {
    GI: giCharacters,
    HSR: hsrCharacters,
    HI3: hi3Characters,
    ZZZ: zzzCharacters,
    TOT: totCharacters,
  };

  const currentCharacters = characterMap[selectedGame] || [];

  // Memoize the filtered image list items to avoid recomputing them
  // at every render
  const memoizedImageListItems = useMemo(() => {
    const s = search.toLowerCase();
    return currentCharacters.map((c, index) => {
      if (
        s === c.id ||
        c.name.toLowerCase().includes(s) ||
        c.character.toLowerCase().includes(s)
      ) {
        return (
          <ImageListItem
            key={index}
            onClick={() => {
              handleClose();
              setCharacter(index);
            }}
            sx={{
              cursor: "pointer",
              "&:hover": {
                opacity: 0.5,
              },
              "&:active": {
                opacity: 0.8,
              },
            }}
          >
            <img
              src={`img/${selectedGame}/${c.img}`}
              srcSet={`img/${selectedGame}/${c.img}`}
              alt={c.name}
              loading="lazy"
            />
          </ImageListItem>
        );
      }
      return null;
    });
  }, [search, setCharacter, currentCharacters, selectedGame]);

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        color="secondary"
        onClick={handleClick}
      >
        Pick character
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="modal"
      >
        <div className="picker-search">
          <TextField
            select
            label="Select Game"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
            size="small"
            color="secondary"
            style={{ marginBottom: "0.5rem" }}
          >
            <option value="GI">Genshin Impact</option>
            <option value="HSR">Honkai Star Rail</option>
            <option value="HI3">Honkai Impact 3rd</option>
            <option value="ZZZ">Zenless Zone Zero</option>
            <option value="TOT">Tears of Themis</option>
          </TextField>
          <TextField
            label="Search character"
            size="small"
            color="secondary"
            value={search}
            multiline={true}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="image-grid-wrapper">
          <ImageList
            sx={{
              width: window.innerWidth < 600 ? 300 : 500,
              height: 450,
              overflow: "visible",
            }}
            cols={window.innerWidth < 600 ? 3 : 4}
            rowHeight={140}
            className="image-grid"
          >
            {memoizedImageListItems}
          </ImageList>
        </div>
      </Popover>
    </div>
  );
}