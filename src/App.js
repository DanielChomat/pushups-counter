import React from "react";
import './style/main.scss';

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import {ContextProvider} from "./components/Contexts/PushupsContext";


const App = () => {
    return (
        <ContextProvider>
            <Header isDashboard/>
            <main>
                <Dashboard/>
            </main>
        </ContextProvider>
    );
}

export default App