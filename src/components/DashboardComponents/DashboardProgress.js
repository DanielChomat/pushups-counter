import React from "react";
import ProgressBar from "../ProgressBar";

const DashboardProgress = () => {
    const progressBars = [{
        label: "GTD - Getting things done!",
        progress: 33
    }];

    return (
        <section>
            <h3>Progress</h3>
            {progressBars.map(progressBar => (<ProgressBar data={progressBar}/>))}
        </section>
    );
}

export default DashboardProgress