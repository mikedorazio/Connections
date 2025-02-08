import { useState, useEffect } from "react";
import Connections from "./Connections";
import Header from "./Header";
import wordData, {categoryData} from "../data/data.js";
import { ToastContainer, Flip } from "react-toastify";

function App() {
    const [data, setData] = useState();
    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [initFlag, setInitFlag] = useState(true);

    console.log(wordData, categoryData);
    // TOFIX: this is unecessary...put inits in useState() above
    if (initFlag) {
        setData(wordData);
        setInitFlag(false);
    }

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