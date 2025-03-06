import { useState, useEffect } from "react";
import Connections from "./Connections";
import Header from "./Header";
import wordData, {categoryData} from "../data/data.js";
import { ToastContainer, Flip } from "react-toastify";

function App() {
    const [data, setData] = useState(wordData);

    return (
        <>
            <div className="app-container">
                <Header />
                <Connections data={data} categoryData={categoryData} />
                <ToastContainer
                    position="top-left"
                    hideProgressBar
                    transition={Flip}
                    icon={false}
                    theme="colored"
                />
            </div>
        </>
    );
}

export default App;