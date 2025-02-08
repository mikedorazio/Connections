export default function Options ( {isSubmitDisabled, isDeselectDisabled } ) {

    return (
        <div className="button-container">
               <button id="shuffle" className="shuffle-button">Shuffle</button>
               <button id="deselectAll" disabled={isDeselectDisabled} className="deselect-all-button">Deselect All</button>
               <button id="submit" disabled={isSubmitDisabled} className="submit-button">Submit</button>
        </div>
    )
}