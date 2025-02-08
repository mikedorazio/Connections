export default function Word({ position, hint, isHintSelected }) {
    console.log("key:", position);

    return (
        <div className="word" position={position}>
            <label key={hint.id} htmlFor={hint.id} className={isHintSelected ? 'selected' : null} >
                                                    {/* need defaultChecked to keep it an uncontrolled input */}
                <input id={hint.id} key={hint.hint} className="hidden-checkbox" defaultChecked={isHintSelected} type="checkbox" />
                <span>{hint.hint}</span>
            </label>
        </div>
    );
}
