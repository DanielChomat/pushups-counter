import React, {useContext, useEffect} from "react";
import {PushupsContext} from "../Contexts/PushupsContext";
import bb, {bar} from "billboard.js";

import "billboard.js/dist/billboard.css";

const DashboardGraphs = () => {
    const {pushups} = useContext(PushupsContext);

    const getFormattedDate = (date) =>
        `${date.getDate()}. ${date.getMonth() + 1}.`;

    const getLastFewDays = () => {
        const today = new Date();
        const count = 5;
        const array = [getFormattedDate(today)];

        for (let i = 1; i <= count; i++) {
            const dayBefore = new Date(today);
            dayBefore.setDate(today.getDate() - i);
            array.unshift(getFormattedDate(dayBefore));
        }
        return array;
    };

    const getAppropriatePushups = (days) => {
        const array = [];
        const stuff = pushups;

        days.forEach((day) => {
            const thing = stuff.filter(
                (pushup) => day === getFormattedDate(new Date(pushup.data.created_at))
            );

            let total = 0;
            if (thing.length !== 0) {
                total = thing.reduce(
                    (accum, {data: {count}}) => accum + parseInt(count, 10),
                    total
                );
            }

            array.push(total);
        });
        return array;
    };

    const renderBarChart = () => {
        const arrayOfCategories = getLastFewDays();
        const arrayOfPushups = getAppropriatePushups(arrayOfCategories);
        pushups &&
        bb.generate({
            data: {
                columns: [["Pushups per day", ...arrayOfPushups]],
                type: bar(),
            },
            axis: {
                y: {
                    padding: {
                        top: 40,
                        bottom: 0,
                    },
                },
                x: {
                    type: "category",
                    categories: arrayOfCategories,
                },
            },
            bar: {
                width: {
                    ratio: 0.5,
                },
            },
            bindto: "#chart",
        });
    };

    useEffect(() => {
        renderBarChart();
    }, [pushups]);

    return (
        <section className={"col-span-2"}>
            <h3>Graphs!</h3>

            <div id="chart"/>
        </section>
    );
};

export default DashboardGraphs;
