import { useState } from "react";
import { toast } from "react-toastify";

const useConnections = (todaysHintData, categoryData) => {
    //console.log("useConnection().answer: ", todaysHintData);
    const [selectionCount, setSelectionCount] = useState(0); // number of current selections in grid
    const [initFlag, setInitFlag] = useState(true); // flag to set up data to start the puzzle
    const [currentSelections, setCurrentSelections] = useState([]); // names of current selections (need???)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isDeselectDisabled, setIsDeselectDisabled] = useState(true);
    const [randomHintOrder, setRandomHintOrder] = useState(calculateRandomHintOrder); // random order of the 16 hints
    const [mistakesRemaining, setMistakesRemaining] = useState(4);
    const [previousGuesses, setPreviousGuesses] = useState([]);
    console.log("useConnections.todaysHintData:", todaysHintData);

    // the random array of numbers that hold the display order of hints [4, 7, 13, 9, 2, 11, 1, 10, 8, 5, 6, 0, 15, 14, 3, 12]
    function calculateRandomHintOrder() {
        const length = 16;
        const max = 16;
        const set = new Set();
        while (set.size < length) {
            set.add(Math.floor(Math.random() * max));
        }
        return Array.from(set);
    }

    // update background color for selected items
    function updateSelectedStyle(event, shouldAdd) {
        const element = event.srcElement;
        const parentElement = element.parentElement;
        if (shouldAdd) parentElement.setAttribute("class", "selected");
        if (!shouldAdd) parentElement.removeAttribute("class");
        console.log("srcElement", event.srcElement);
    }
    
    // check the 4 current selections against the 4 answers and see if they are
    // all from the same category of entries
    function evaluateGuess() {
        setPreviousGuesses(prev => [...prev, currentSelections]);
        let newSet = new Set();
        currentSelections.map((selection) => {
            let entry = [];
            console.log("useConnections.selection", selection);
            entry = todaysHintData.find((hint) => hint.id == selection);
            console.log("useConnections.entry", entry);
            newSet.add(entry.category);
        });
        console.log("useConnections.newSet", newSet);
        return newSet.size;
    }

    // animate the 4 selected entries for an incorrect guess
    function shakeIncorrectGuesses() {
        const labels = document.querySelectorAll('[class="selected"]');
        console.log("labels", labels);
        labels.forEach((label) => {
            console.log("currentInput to be shaken", label);
            label.classList.add("shaken");
        });
        setTimeout(() => {
            labels.forEach((label) => {
                label.classList.remove("shaken");
            });
        }, 2000);
    }

    // animate the 4 selected entries for a correct guess
    function bounceCorrectGuesses() {
        const labels = document.querySelectorAll('[class="selected"]');
        const flipOrBounce = Math.random() > 0.5;
        const classValue = flipOrBounce ? "flip" : "bounce";
        console.log("labels", labels);
        labels.forEach((label) => {
            console.log("currentInput to be shaken", label);
            label.classList.add(classValue);
        });
        setTimeout(() => {
            labels.forEach((label) => {
                label.classList.remove(classValue);
            });
        }, 2000);
    }

    // unselect every button
    function deselectAllButtons(event) {
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            } else if (input.type === "text" || input.type === "email" || input.type === "number") {
                input.value = "";
            }
        });
        setIsDeselectDisabled(true);
        setSelectionCount(0);
        setCurrentSelections([]);
    }

    // has this current guess already been used?
    function isDuplicateGuess() {
        console.log(
            "isDupGuess.currentSelections",
            currentSelections,
            "prevGuesses",
            previousGuesses
        );
        let duplicateFound = false;
        if (previousGuesses.length == 0) {
            console.log("isDupGuess.no previous guesses...");
            return false;
        }
        let guessSet = new Set(currentSelections);
        const guessSetCount = guessSet.size;

        previousGuesses.forEach((guessRow) => {
            guessRow.forEach((guess) => {
                guessSet.add(guess);
            });
            if (guessSet.size == 4) {
                console.log("isDupGuess found a duplicate");
                // cant return here...it will just return from the forEach current iteration
                // TODO: a nested for loop might be better than nested forEach because of this
                duplicateFound = true;
            }
            guessSet = new Set(currentSelections);
        });
        console.log("isDupGuess.guessSet", guessSet, "isDupGuess.guessSetCount", guessSetCount);
        return duplicateFound;
    }

    // handle the event of a clue being selected
    function handleChange(event) {
        //console.log("currentSelections are:", currentSelections);
        let buttonValue = event.target.getAttribute("id");
        // a button was de-selected. Update the count, remove from current selections and disable Submit button
        if (!event.target.checked) {
            setSelectionCount((prev) => prev - 1);
            setCurrentSelections(currentSelections.filter((item) => item !== buttonValue));
            updateSelectedStyle(event, false);
            setIsSubmitDisabled(true);
            if (selectionCount == 1) setIsDeselectDisabled(true);
            return;
        }
        setIsDeselectDisabled(false);
        // already at max number of selections...just ignore
        if (selectionCount > 3) {
            event.target.checked = false;
            return;
        }
        // the 4th button was hit...enable Submit button
        if (selectionCount == 3) {
            console.log("enable Submit button");
            setIsSubmitDisabled(false);
        }
        setSelectionCount((previousValue) => previousValue + 1);
        setCurrentSelections((prev) => [...prev, buttonValue]);
        updateSelectedStyle(event, true);
    }

    // handle Button press events
    function handleMouseUp(event) {
        //console.log("mouse up", event.target);
        let button = event.target.getAttribute("id");
        if (!button) return;
        //console.log("buttonId is", button);
        switch (button) {
            case "shuffle":
                console.log("shuffle:", currentSelections);
                setRandomHintOrder(calculateRandomHintOrder());
                break;
            case "deselectAll":
                deselectAllButtons(event);
                break;
            case "submit":
                if (isDuplicateGuess()) {
                    toast.warning("Already Guessed This. 😔", {autoClose: 2000});
                    break;
                }
                const numberOfCorrectGuesses = evaluateGuess();
                if (numberOfCorrectGuesses == 1) {
                    //putting this after the toast call it did not work...
                    setIsSubmitDisabled(true);
                    // Correct Guess - Check if Game Over
                    toast.success("Great Job!!!", { autoClose: 2000 });
                    bounceCorrectGuesses();
                    //moveUpSuccessfulEntries();
                    //setIsSubmitDisabled(true);
                } else {
                    // Wrong Guess:
                    toast.warning("OUCH!! 😕", { autoClose: 2000 });
                    setMistakesRemaining((prev) => prev - 1);
                    if (mistakesRemaining == 1) console.log("Game OVER 😝 ");
                    shakeIncorrectGuesses();
                    setIsSubmitDisabled(true);
                }
                console.log(
                    "number of unique categories for selections is " + numberOfCorrectGuesses
                );
                break;
            default:
                console.log("shouldnt get here...");
        }
    }

    return {
        handleChange,
        handleMouseUp,
        isSubmitDisabled,
        isDeselectDisabled,
        randomHintOrder,
        mistakesRemaining,
        currentSelections
    };
};

export default useConnections;
