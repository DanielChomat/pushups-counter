import React from "react";

const ProgressBar = ({data}) => {

    const percent = `${data.progress}%`;

    return (<>
            <label className={"h4"} htmlFor={"file"}>{data.label}</label>

            <div className={"progress-bar"}>
                <progress id="file" max={data.max ?? 100} value={data.progress}>{percent}</progress>
                <span>{percent}</span>
            </div>
        </>
    )
}

export default ProgressBar;