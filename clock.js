import { React, useState, useEffect } from "react";
import "./clock.scss";

export default function Clock() {
  let [getValue, setValue] = useState({
      breakLength: 5,
      Start: false,
      sessionLength: 25,
      timerType: "Session",
      color: "white",
      background: "container-fluid dark",
      reset: false,
      settings: false,
      timerInfo: true,
      darkMode: true,
      status: "Settings",
    }),
    [Timer, setTimer] = useState(1500),
    [index, setindex] = useState(0),
    [audio, setAudio] = useState(
      new Audio("https://freesound.org/data/previews/536/536420_4921277-lq.mp3")
    );

  let clock;

  useEffect(() => {
    if (getValue.Start) {
      clock = setInterval(int, 1000);
      function int() {
        decrement();
        Phase();
      }
    }
    return () => {
      clearInterval(clock);
    };
  }, [getValue.Start]);

  //

  let decrement = () => {
    setTimer((Timer -= 1));
  };

  // control Phase between break and session

  function Phase() {
    let { timerType, Start } = getValue;

    warning(Timer);

    if (Timer < 0 && Start === true) {
      setValue((rest) => ({ ...rest, Start: false }));
      clearInterval(clock);

      if (timerType === "Session") {
        timerSwitch("Break", getValue.breakLength * 60, "green");
        phaseStart();
      } else {
        timerSwitch("Session", getValue.sessionLength * 60, "white");
        phaseStart();
      }
    }
  }

  // for start nexr phase

  function phaseStart() {
    setValue((rest) => ({ ...rest, Start: true }));
  }

  // for change color and timerType

  let timerSwitch = (type, duration, color) => {
    setValue((rest) => ({
      ...rest,
      timerType: type,
      color: color,
    }));
    setTimer(duration);
  };

  function warning(cd) {
    if (cd === 0) {
      audio.play();
    }
    if (cd < 61 && getValue.timerType === "Session") {
      setValue((rest) => ({
        ...rest,
        color: "red",
      }));
    } else if (cd < 61 && getValue.timerType === "Break") {
      setValue((rest) => ({
        ...rest,
        color: "orange",
      }));
    }
  }

  const handleStart = () => {
    !getValue.Start
      ? setValue((rest) => ({
          ...rest,
          Start: true,
          reset: false,
          settings: false,
        }))
      : setValue((rest) => ({ ...rest, Start: false }));
  };

  const handleSession = (e) => {
    let value = e.target.name;
    if (!getValue.Start && getValue.timerType === "Session") {
      if (value === "increment" && getValue.sessionLength !== 60) {
        setValue((rest) => ({
          ...rest,
          sessionLength: getValue.sessionLength + 1,
          reset: false,
        }));
        setTimer(getValue.sessionLength * 60 + 60);
      } else if (value === "decrement" && getValue.sessionLength !== 1) {
        setValue((rest) => ({
          ...rest,
          sessionLength: getValue.sessionLength - 1,
          reset: false,
        }));
        setTimer(getValue.sessionLength * 60 - 60);
      }
    }
  };

  const handleBreak = (e) => {
    let value = e.target.name;
    let { breakLength } = getValue;
    if (!getValue.Start) {
      if (value === "increment" && breakLength !== 60) {
        setValue((rest) => ({
          ...rest,
          breakLength: breakLength + 1,
          reset: false,
        }));
      } else if (value === "decrement" && breakLength !== 1) {
        setValue((rest) => ({
          ...rest,
          breakLength: breakLength > 0 ? breakLength - 1 : 0,
          reset: false,
        }));
      }
    }
  };

  // some mathematics operation for accurate timing

  const minAndSec = () => {
    let minutes = Math.floor(Timer / 60);
    let Seconds = Timer - minutes * 60;
    Seconds = Seconds < 10 ? "0" + Seconds : Seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + Seconds;
  };

  const resetFun = () => {
    setValue((rest) => ({
      ...rest,
      breakLength: 5,
      Start: false,
      sessionLength: 25,
      timerType: "Session",
      color:
        getValue.background === "container-fluid light" ? "black" : "white",
      reset: true,
    }));
    setTimer(1500);
    audio.play() ? audio.pause() : audio.pause();
  };

  let audios = [
    "https://freesound.org/data/previews/536/536420_4921277-lq.mp3",
    "http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg",
    "https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3",
    "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav",
    "http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg",
    "http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3",
    "https://rpg.hamsterrepublic.com/wiki-images/d/d7/Oddbounce.ogg",
    "https://assets.mixkit.co/sfx/preview/mixkit-dog-barking-twice-1.mp3",
    "https://assets.mixkit.co/sfx/preview/mixkit-alarm-tone-996.mp3",
  ];
  let alertsName = [
    "Default",
    "Evil laugh",
    "classic alarm",
    "Pause",
    "intro music",
    "Got item",
    "Old bounce",
    "bark",
    "alarm tone",
  ];

  // view classes for different types of view

  let view = ["scroll", "timer-info", "Alerts", "activate"];

  let hideORshow = ["hide", "show"];

  // set view between dark and light mode

  function setView() {
    let { timerInfo, darkMode, timerType, settings } = getValue;
    let len = alertsName.length;
    let selected = "";
    for (let i = 0; i < len; i++) {
      if (audio.src === audios[i]) {
        selected = audios.indexOf(audios[i]);
      }
    }
    if (darkMode) {
      setValue((rest) => ({
        ...rest,
        darkMode: false,
        status: "Dark-mode off",
        background: "container-fluid light",
        color: "black",
      }));
    } else {
      setValue((rest) => ({
        ...rest,
        darkMode: true,
        status: "Dark-mode on",
        background: "container-fluid dark",
        color: "white",
      }));
    }
    setTimeout(() => {
      setValue((rest) => ({
        ...rest,
        status: !timerInfo
          ? alertsName[selected]
          : settings
          ? "Settings"
          : timerType,
      }));
    }, 1000);
  }

  // set alerts with same alert names & show name in status

  function setAlert() {
    let len = alertsName.length;
    let selected = "";
    for (let i = 0; i < len; i++) {
      if (audio.src === audios[i]) {
        selected = audios.indexOf(audios[i]);
      }
    }
    setValue((rest) => ({
      ...rest,
      timerInfo: false,
      status: alertsName[selected],
    }));
  }

  // select alert & play on first click

  function select() {
    if (!getValue.timerInfo) {
      let selected = audios[index];
      let PLAY = new Audio(selected);
      setValue((rest) => ({ ...rest, status: alertsName[index] }));
      localStorage.setItem(JSON.stringify(index), selected);
      let getSelected = localStorage.getItem(index);
      setAudio(new Audio(getSelected));
      getValue.status !== alertsName[index] ? PLAY.play() : PLAY.pause();
    }
  }

  // open settings for diffrent operations

  function openSet() {
    if (!getValue.Start) {
      getValue.settings || !getValue.timerInfo
        ? setValue((rest) => ({
            ...rest,
            settings: false,
            timerInfo: true,
          }))
        : setValue((rest) => ({
            ...rest,
            settings: true,
            status: "Settings",
          }));
    }
  }

  // scroll between alerts

  function slider(e) {
    let action = e.target.id,
      total = alertsName.length;
    if (action === "up" && index !== total - 1) {
      setindex(index + 1);
    } else if (action === "down" && index !== 0) {
      setindex(index - 1);
    }
  }

  return (
    <div className={getValue.background}>
      <INFOSCREEN
        session={getValue.sessionLength}
        timerType={getValue.timerType}
        ms={minAndSec()}
        breakLength={getValue.breakLength}
        settings={getValue.settings}
        timerInfo={getValue.timerInfo}
        status={getValue.status}
        color={getValue.color}
        alertsName={alertsName}
        audios={audios}
        setAlerts={setAlert}
        index={index}
        slider={slider}
        select={select}
        view={view}
        hideORshow={hideORshow}
      />

      <div id="allControls">
        <Break
          add={handleBreak}
          hideORshow={hideORshow}
          settings={getValue.settings}
          breakLength={getValue.breakLength}
        />
        <Controls
          Reset={getValue.reset}
          Start={getValue.Start}
          color={getValue.color}
          startFun={handleStart}
          timerReset={resetFun}
          settings={getValue.settings}
          timerInfo={getValue.timerInfo}
          darkMode={getValue.darkMode}
          status={getValue.status}
          alertsName={alertsName}
          audios={audios}
          setAlerts={setAlert}
          openSettings={openSet}
          hideORshow={hideORshow}
          setView={setView}
        />
        <Session
          length={handleSession}
          settings={getValue.settings}
          hideORshow={hideORshow}
          session={getValue.sessionLength}
        />
      </div>
    </div>
  );
}

function INFOSCREEN({
  Start,
  color,
  timerType,
  settings,
  timerInfo,
  status,
  alertsName,
  index,
  slider,
  view,
  ms,
  hideORshow,
  select,
}) {
  return (
    <div className={timerInfo ? "TIMER" : "ALARM-SETTINGS"}>
      <p id='timer-label' className="status" style={{ color: color }}>
        {!settings
          ? timerType
          : settings && !timerInfo
          ? "Selected : " + status
          : !Start
          ? status
          : timerType}
      </p>
      <button
        onClick={slider}
        id="up"
        className={timerInfo ? hideORshow[0] : `${hideORshow[1]} ${view[0]}`}
      >
        <i className="fad fa-angle-up"></i>
      </button>

      <h1
        id="timer-left"      
        className={timerInfo ? view[1] : view[2]}
        style={{ color: color }}
        onClick={select}
      >
        {timerInfo ? ms : alertsName[index]}
      </h1>

      <button
        onClick={slider}
        id="down"
        className={timerInfo ? hideORshow[0] : `${hideORshow[1]} ${view[0]}`}
      >
        <i className="fad fa-angle-down"></i>
      </button>
    </div>
  );
}

function Controls({
  Start,
  timerReset,
  startFun,
  Reset,
  settings,
  timerInfo,
  darkMode,
  setAlerts,
  openSettings,
  setView,
  hideORshow,
}) {
  let anim = [
    "fas fa-redo anim1",
    "fas fa-redo",
    "fad fa-cog anim2",
    "fad fa-cog anim1",
    "fad fa-cog anim3",
    "fad fa-bell",
    "fad fa-bell activate",
    "fad fa-home-alt",
  ];

  let JSX1 = (
    <i
      id="wheel"
      className={!settings ? anim[2] : !timerInfo ? anim[7] : anim[3]}
    ></i>
  );

  let JSX2 = (<span class="loader"></span>);

  return (
    <div id="Three-Control-Btn">
      <button
        id="start_stop"
        title="start/stop"
        className={!settings ? "start-btn" : hideORshow[0]}
        onClick={startFun}
      >
        {Start ? (
          <i className="fas fa-pause-circle"></i>
        ) : (
          <i className="fas fa-play-circle"></i>
        )}
      </button>

      <div id="setting">
        <button
          title="Alerts"
          onClick={setAlerts}
          className={
            !settings ? hideORshow[0] : !Start ? hideORshow[1] : hideORshow[0]
          }
          id="beep"
          
        >
          <i className={!timerInfo ? anim[6] : anim[5]}></i>
        </button>

        <button
          title={!timerInfo ? "Home" : Start ? "" : "Settings"}
          id="set"
          onClick={openSettings}
        >
          {!Start ? JSX1 : JSX2}
        </button>

        <button
          title="Dark/Light"
          id="view"
          className={
            !settings ? hideORshow[0] : !Start ? hideORshow[1] : hideORshow[0]
          }
          onClick={setView}
        >
          <i
            className={
              darkMode ? "fas fa-moon dark-mode" : "fad fa-sun dark-mode"
            }
          ></i>
        </button>
      </div>

      <button
        id="reset"
        title="Reset"
        onClick={timerReset}
        className={!settings ? "reset-btn" : hideORshow[0]}
      >
        <i className={Reset ? anim[0] : anim[1]}></i>
      </button>
    </div>
  );
}

function Break({ breakLength, add, hideORshow, settings }) {
  return (
    <div className={!settings ? "Break" : hideORshow[0]}>
      <p id="break-label" >Break Length</p>
      <div id="Break-control">
        <button id="break-increment" className="Arrow-Btn" name="increment" onClick={add}>
          <i className="fal fa-arrow-circle-up"></i>
        </button>

        <span>{breakLength}</span>

        <button id="break-decrement" className="Arrow-Btn" name="decrement" onClick={add}>
          <i className="fal fa-arrow-circle-down"></i>
        </button>
      </div>
    </div>
  );
}

function Session({ session, length, hideORshow, settings }) {
  return (
    <div  className={!settings ? "Session" : hideORshow[0]}>
      <p id="session-label" > Session Length </p>
      <div id="Session-control">
        <button id="session-increment" className="Arrow-Btn" name="increment" onClick={length}>
          <i className="fal fa-arrow-circle-up"></i>
        </button>

        <span>{session}</span>

        <button id="session-decrement" className="Arrow-Btn" name="decrement" onClick={length}>
          <i className="fal fa-arrow-circle-down"></i>
        </button>
      </div>
    </div>
  );
}
