export default function Mistakes({ mistakesRemaining }) {
    let mistakesArray = [];
    if (mistakesRemaining > 0) {
        mistakesArray = Array(mistakesRemaining).join(".").split(".");
    } else {
        mistakesArray = []
    }

    //console.log("mistakesArray", mistakesRemaining, mistakesArray);
    return (
        <>
            <div className="mistakes-container">
                <span className="mistakes-remaining-text">Mistakes Remaining:</span>
                {mistakesArray.map((entry, index) => (
                    <span key={index} className="mistakes-span"></span>
                ))}
            </div>
        </>
    );
}
