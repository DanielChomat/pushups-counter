import React, {useState} from "react";

import PushupsDownIcon from "../../assets/icons/pushups-down";
import PushupsUpIcon from "../../assets/icons/pushups-up";

import useInterval from "../../hooks/useInterval";

export default () => {
    const [animation, setAnimation] = useState(false);

    useInterval(() => {
        setAnimation(!animation);
    }, 1000);

    return animation ? <PushupsUpIcon /> : <PushupsDownIcon />;
}