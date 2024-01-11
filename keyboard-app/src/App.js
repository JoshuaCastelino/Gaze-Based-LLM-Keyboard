import React, { useState } from "react";
import { sendDataToFlask } from "./services/sendDataToFlask";
import Switch from "./Switch";
import "./App.css";

function getOppositeColor(currentColor) {
  return currentColor === "light-blue-button"
    ? "dark-blue-button"
    : "light-blue-button";
}

function App() {
  // State to track the button class

  const lightBlueStates = [
    ["I", "T", "A", "N", "%", "E", "DEL", "+", "."],
    ["I", "T", "A", "N", "%", "E", "DEL", "+", "->"],
    ["I", "T", "A", "N", "%", "E", "<-", "+", "->"],
  ];

  const darkBlueStates = [
    ["D", "O", "S", "L", "%", "R", "DEL", "+", "."],
    ["D", "O", "S", "L", "%", "R", "DEL", "+", "->"],
    ["D", "O", "S", "L", "%", "R", "<-", "+", "->"],
  ];

  const allStates = [lightBlueStates, darkBlueStates];
  const [switchFace, setSwitchFace] = useState(0);
  const [currentState, setCurrentState] = useState(0);
  const [buttonClass, setButtonClass] = useState("light-blue-button");
  const [rightArrowCount, setRightArrowCount] = useState(0);
  const [delCount, setDelCount] = useState(0);

  const [currentWord, setCurrentWord] = useState("");
  const [currentWordChoices, setCurrentWordChoices] = useState([]);
  const [currentSentence, setCurrentSentence] = useState("");
  const [allWords, setAllWords] = useState([]);

  var buttonLabels = allStates[switchFace][currentState];
  var spaceClassName =
    currentState === 0
      ? "flex-center-button space-button"
      : "flex-center-button red-space-button";

  const onSwitch = () => {
    if (currentState !== 0) {
      setAllWords([...allWords, currentWord]);
      setCurrentWord("");
    }

    setSwitchFace((prevSwitchFace) => (prevSwitchFace === 1 ? 0 : 1));
    setButtonClass((prevClass) =>
      prevClass === "light-blue-button"
        ? "dark-blue-button"
        : "light-blue-button"
    );
    if (currentState !== 0) {
      setCurrentState(0);
    }
  };

  const onSpace = async () => {
    console.log("Searching for: " + currentWord);
    console.log("Current sentence: " + currentSentence);
    var nextState = 1;
    // Send currentWord to the backend
    if (currentState === 0) {
      try {
        const response = await sendDataToFlask({
          currentWord: currentWord,
          currentSentence: currentSentence,
        });
        console.log("Response recieved");
        console.log("Response from backend:", response);
        setCurrentWordChoices([currentWord, ...response[1]]);
        if (response[1].length === 1) {
          setCurrentWord(response[1][0].toUpperCase());
          setRightArrowCount(1);
          nextState = 2;
        }
      } catch (error) {
        console.error("Error sending word to backend:", error);
      }
      setCurrentSentence(currentSentence + " ");
      setCurrentState(nextState);
    } else {
      console.log("RESETTING ALL STATES");
      setAllWords([]);
      setCurrentWord("");
      setCurrentSentence("");
      setCurrentState(0);
    }
  };

  const onRightArrow = () => {
    if (rightArrowCount < currentWordChoices.length - 1) {
      setCurrentWord(currentWordChoices[rightArrowCount + 1].toUpperCase());
      console.log(
        "Current word: " + currentWordChoices[rightArrowCount + 1].toUpperCase()
      );
      setRightArrowCount(rightArrowCount + 1);
    }

    if (currentState === 1) {
      setCurrentState(2);
    }
  };

  const onLeftArrow = () => {
    if (rightArrowCount === 1) {
      setCurrentState(1);
    } else if (rightArrowCount === 0) {
      setCurrentState(0);
    }
    setCurrentWord(currentWordChoices[rightArrowCount - 1].toUpperCase());
    console.log(
      "Current word: " + currentWordChoices[rightArrowCount - 1].toUpperCase()
    );
    setRightArrowCount(rightArrowCount - 1);
  };

  const onDepress = (label) => {
    console.log("Depressed: " + label);

    // WHEN BACKSPACE IS PRESSED
    if (label === "DEL") {
      // REMOVE LAST CHARACTER FROM RELEVANT STATES
      if (currentSentence.length > 0) {
        setCurrentSentence(currentSentence.slice(0, -1));
      }
      if (currentWord.length > 0) {
        setCurrentWord(currentWord.slice(0, -1));
      }
      // IF CURRENT WORD IS EMPTY
      else {
        // IF THERE ARE STILL WORDS IN THE SENTENCE
        if (allWords.length > 0) {
          // GET THE LAST WORD FROM THE LIST OF WORDS
          var lastWord = allWords[allWords.length - 1];
          // REMOVE THE LAST WORD FROM THE LIST OF WORDS
          setAllWords(allWords.slice(0, -1));
          // SET THE CURRENT WORD TO THE PREVIOUS WORD
          setCurrentWord(lastWord);
        }
      }

      console.log(currentWord);
    }

    // WHEN A CHARACTER IS TYPED
    else {
      console.log("UPDATING CURRENT WORD");
      // APPEND TO THE SENTENCE
      setCurrentSentence(currentSentence + label);
      // IF RETURNING FROM A SPACE
      if (currentState != 0) {
        // WRITE THE CURRENT WORD TO THE LIST OF WORDS
        setAllWords([...allWords, currentWord]);
        // OVERWRITE THE CURRENT WORD
        setCurrentWord(label);
      } else {
        setCurrentWord(currentWord + label);
      }
    }

    // ENSURE THAT WE ARE IN BASE STATE AFTER TYPING ANY CHARACTER
    setCurrentState(0);
  };

  const buttons = buttonLabels.map((label) => {
    let className;
    let onClick = onDepress.bind(this, label);
    switch (label) {
      case "DEL":
        className = "flex-center-button red-button";
        break;
      case ".":
        className = "flex-center-button red-button";
        break;
      case "%":
        className = "flex-center-button wildcard-button";
        break;
      case "<-":
        className = "flex-center-button purple-button";
        onClick = onLeftArrow;
        break;
      case "->":
        className = "flex-center-button purple-button";
        onClick = onRightArrow;
        break;
      case "+":
        return (
          <Switch
            key="Switch"
            buttonClass={getOppositeColor(buttonClass)}
            buttonLabels={allStates[switchFace === 0 ? 1 : 0][0]}
            onSwitchClick={onSwitch}
            currentWord={currentWord}
          />
        );
      default:
        className = `flex-center-button ${buttonClass}`; // Use state for class
        break;
    }

    return (
      <button className={className} key={label} onClick={onClick}>
        {label}
      </button>
    );
  });

  return (
    <div>
      <div className="grid-container">{buttons}</div>
      <button className={spaceClassName} onClick={onSpace}>
        {currentState === 0 ? "Space" : "."}
      </button>
    </div>
  );
}

export default App;
