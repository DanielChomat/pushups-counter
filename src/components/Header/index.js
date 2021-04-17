import React from "react";

const Header = ({isDashboard, pageTitle = "Dashboard"}) => {
    return (
        <header className="App-header">
            <a href={"/"}>
                {isDashboard ?
                    <h1 className={"app-name"}>Pushups Counter</h1> : <h2 className={"app-name"}>Pushups Counter</h2>
                }
            </a>
            {!isDashboard ?
                <h1 className={"page-title"}>{pageTitle}</h1> : <h2 className={"page-title"}>{pageTitle}</h2>
            }
            <h3>By Danik</h3>
        </header>
    )
}

export default Header;