import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Picker from "./components/Picker";
import Info from "./components/Info";
import getConfiguration from "./utils/config";
import log from "./utils/log";
import { CirclePicker } from "react-color";

const { ClipboardItem } = window;

function App() {
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await getConfiguration();
      } catch (error) {
        console.log(error);
      }
    };
    fetchConfig();
  }, []);

  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("GI");
  const [characters, setCharacters] = useState([]);
  const [characterIndex, setCharacterIndex] = useState(0);

  const character = characters[characterIndex] || {
    defaultText: { text: "", x: 148, y: 128, s: 30, r: 0 },
    img: "",
    name: "unknown",
    id: "unknown",
    color: "#ffffff",
  };

  const [text, setText] = useState(character.defaultText.text);
  const [position, setPosition] = useState({
    x: character.defaultText.x,
    y: character.defaultText.y,
  });
  const [fontSize, setFontSize] = useState(character.defaultText.s);
  const [spaceSize, setSpaceSize] = useState(50);
  const [rotate, setRotate] = useState(character.defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fontColor, setFontColor] = useState(character.color);
  const img = new Image();

  useEffect(() => {
    if (!character) return;

    setText(character.defaultText.text);
    setPosition({
      x: character.defaultText.x,
      y: character.defaultText.y,
    });
    setRotate(character.defaultText.r);
    setFontSize(character.defaultText.s);
    setFontColor(character.color);
    setLoaded(false);
  }, [characterIndex, characters]);

  img.src = `img/${selectedGame}/${character.img}`;
  img.onload = () => setLoaded(true);

  let angle = (Math.PI * text.length) / 7;

  const draw = (ctx) => {
    ctx.canvas.width = 296;
    ctx.canvas.height = 256;

    if (loaded && document.fonts.check("12px YurukaStd")) {
      const hRatio = ctx.canvas.width / img.width;
      const vRatio = ctx.canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      const centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
      ctx.font = `${fontSize}px YurukaStd`;
      ctx.lineWidth = 9;
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(rotate / 10);
      ctx.textAlign = "center";
      ctx.fillStyle = fontColor;

      const lines = text.split("\n");
      if (curve) {
        for (let line of lines) {
          for (let i = 0; i < line.length; i++) {
            ctx.rotate(angle / line.length / 2.5);
            ctx.save();
            ctx.translate(0, -1 * fontSize * 3.5);
            ctx.strokeText(line[i], 0, 0);
            ctx.fillText(line[i], 0, 0);
            ctx.restore();
          }
        }
      } else {
        let yOffset = 0;
        for (const line of lines) {
          ctx.strokeText(line, 0, yOffset);
          ctx.fillText(line, 0, yOffset);
          yOffset += spaceSize;
        }
      }
      ctx.restore();
    }
  };

  const download = () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `Sticker_${character.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
    log(character.id, character.name, "download");
  };

  function b64toBlob(b64Data, contentType = "image/png", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = Array.from(slice).map((char) => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const copy = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
      }),
    ]);
    log(character.id, character.name, "copy");
  };

  return (
    <div className="App">
      <Info open={infoOpen} handleClose={() => setInfoOpen(false)} />
      <div className="container">
        <div className="vertical">
          <div className="canvas">
            <Canvas draw={draw} />
          </div>
          <Slider
            value={curve ? 256 - position.y + fontSize * 3 : 256 - position.y}
            onChange={(e, v) =>
              setPosition({
                ...position,
                y: curve ? 256 + fontSize * 3 - v : 256 - v,
              })
            }
            min={0}
            max={256}
            step={1}
            orientation="vertical"
            track={false}
            color="secondary"
          />
        </div>
        <div className="horizontal">
          <Slider
            className="slider-horizontal"
            value={position.x}
            onChange={(e, v) => setPosition({ ...position, x: v })}
            min={0}
            max={296}
            step={1}
            track={false}
            color="secondary"
          />
          <div className="settings">
            <div>
              <label>Rotate:</label>
              <Slider
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>Font size:</label>
              <Slider
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>Spacing:</label>
              <Slider
                value={spaceSize}
                onChange={(e, v) => setSpaceSize(v)}
                min={18}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>Curve (Beta):</label>
              <Switch
                checked={curve}
                onChange={(e) => setCurve(e.target.checked)}
                color="secondary"
              />
            </div>
            <div>
              <label>Text Color:</label>
              <CirclePicker
                color={fontColor}
                onChangeComplete={(color) => setFontColor(color.hex)}
              />
            </div>
          </div>
          <div className="text">
            <TextField
              label="Text"
              size="small"
              color="secondary"
              value={text}
              multiline
              fullWidth
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="picker">
            <Picker
              setCharacter={setCharacterIndex}
              setCharacters={setCharacters}
              setGame={setSelectedGame}
            />
          </div>
          <div className="buttons">
            <Button color="secondary" onClick={copy}>copy</Button>
            <Button color="secondary" onClick={download}>download</Button>
          </div>
        </div>
        <div className="footer">
          <Button color="secondary" onClick={() => setInfoOpen(true)}>Info</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
