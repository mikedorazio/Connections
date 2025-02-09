import { useEffect, useState } from "react";
import Word from "./Word";
import useConnections from "./hooks/useConnections";
import AnswerGrid from "./AnswerGrid";
import Options from "./Options";
import Mistakes from "./Mistakes";

export default function Connections({ data, categoryData }) {
    const [answerCategories, setAnswerCategories] = useState(initAnswerCategories); // 4 answer categories for today's puzzle
    const [todaysHintData, setTodaysHintData] = useState(initializeTodaysHintData); // 16 entries for todays puzzle based on random 4 categories
    const { handleChange, handleMouseUp, isSubmitDisabled, isDeselectDisabled, randomHintOrder, 
                                mistakesRemaining, currentSelections, isGameOver } = useConnections(todaysHintData, categoryData, answerCategories);

    // get 4 unique random numbers from 0 to the size of categoryData: [0, 1, 3, 7]
    function initAnswerCategories() {
        let numberArray = getRandomNumberArray(categoryData.length, 4);
        console.log("numberArray", numberArray);
        let tempAnswerCategories = [];
        // get the 4 categories that are used for this puzzle
        // TOFIX: can this be done a better way (filter())
        // answerCategories should be constant...
        for (let i = 0; i < 4; i++) {
            tempAnswerCategories.push(categoryData[numberArray[i]]);
        }
        return tempAnswerCategories;
    }
    // build the entire answer array with 4 entries that have a category that
    // matches the 4 entries from the categorData give to the useConnections() method
    function initializeTodaysHintData() {
        // TOFIX: will we have data conflicts? Should we use map to set a new variable and then return that list???
        let todaysData = [];
        data.map((entry, index) => {
            if (answerCategories.includes(entry.category)) {
                //console.log("entry is chosen", entry);
                todaysData.push(entry);
            }
        });
        console.log("categoryData:", categoryData);
        let copyOfData = [...data];
        return todaysData;
    }

    function getRandomNumberArray(max, count) {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * max);
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort();
    }

    useEffect(() => {
        window.addEventListener("change", handleChange);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("change", handleChange);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleChange, handleMouseUp]);

    console.log("isGameOver", isGameOver);
    return (
        <>
             <div className="answer-container" >
                { answerCategories.map((answer,index) => {
                    //console.log(answer);
                    return <AnswerGrid key={index} answer={answerCategories[index]} index={index} />
                })}

            </div>

            <div className="word-container" id="word-container">
                {randomHintOrder.map((hint, i) => {
                    let isHintSelected = currentSelections.includes(''+ todaysHintData[hint].id);
                    //console.log("currentSelections", currentSelections, "hint", todaysHintData[hint].id, "isSelected", isHintSelected);
                    return <Word key={i} position={i} hint={todaysHintData[hint]} isHintSelected={isHintSelected} />;
                })}
            </div>

            {!isGameOver ?
                <Mistakes mistakesRemaining={mistakesRemaining} /> 
                : null
            }

            {!isGameOver ?
                <Options isSubmitDisabled={isSubmitDisabled} isDeselectDisabled={isDeselectDisabled} />
            : null 
            }
        </>
    );
}