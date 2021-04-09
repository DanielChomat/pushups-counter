import React, {useEffect, useState} from "react";
import './style/main.scss';

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import {ContextProvider} from "./components/Contexts/PushupsContext";
import {loginUser, logoutUser} from "./utils/identityActions";
import netlifyIdentity from "netlify-identity-widget";


const App = () => {
    const [userState, setUserState] = useState(null);

    useEffect(() => {
        netlifyIdentity.init({})

        const user = localStorage.getItem("currentOpenSaucedUser");
        if (user) {
            setUserState(JSON.parse(user));
        } else {
            netlifyIdentity.open();
            loginUser();
        }
        netlifyIdentity.on("login", (user) => {
            setUserState(user);
            loginUser()
        });
        netlifyIdentity.on("logout", (user) => {
            setUserState(null);
            logoutUser();
        });
    }, [])

    return (
        <ContextProvider>
            <Header isDashboard user={userState}/>
            <main>
                {netlifyIdentity.currentUser() && <Dashboard/>}
            </main>
        </ContextProvider>
    );
}

export default App