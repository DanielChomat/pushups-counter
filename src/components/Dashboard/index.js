import React, {useContext, useEffect, useState} from "react";

import {PushupsContext, StatsContext} from "../Contexts/PushupsContext";
import api from "../../utils/api";
import isLocalHost from "../../utils/isLocalHost";
import sortByDate from "../../utils/sortByDate";
import {getDailyStuff, getMonthlyStuff, getStuffSum, getTodayStuff, getWeeklyStuff,} from "../../helpers";

import {DashboardGraphs, DashboardProgress, DashboardStats} from "../DashboardComponents";

function removeOptimisticStuff(stuff) {
    // return all 'real' stuff
    return stuff.filter((thing) => {
        return thing.ref;
    });
}

function getStuffId(thing) {
    if (!thing.ref) {
        return null;
    }
    return thing.ref["@ref"].id;
}

const Dashboard = () => {
    const {pushups, setPushups} = useContext(PushupsContext);
    const {setStats} = useContext(StatsContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const resultPushups = await api.readAll();

            if (resultPushups.message === "unauthorized") {
                if (isLocalHost()) {
                    alert(
                        "FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info"
                    );
                } else {
                    alert(
                        "FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct"
                    );
                }
                return false;
            }

            if (resultPushups.code === "ENOTFOUND") {
                return false;
            }

            if (resultPushups.length === 0) {
                return false;
            }

            const orderBy = "desc"; // or `desc`
            const sortOrder = sortByDate(orderBy);
            const pushupsByDate = resultPushups.sort(sortOrder);

            setPushups(pushupsByDate);
        };

        fetchData();
    }, [setPushups]);

    useEffect(() => {
        setStats({
            type: "UPDATE_ALL",
            payload: {
                totalNumberPushups: getStuffSum(pushups) ?? 0,
                totalNumberSessions: pushups.length ?? 0,
                averagePerDay: getDailyStuff(pushups) ?? 0,
                averagePerWeek: getWeeklyStuff(pushups) ?? 0,
                averagePerMonth: getMonthlyStuff(pushups) ?? 0,
                today: {
                    numberPushups: getTodayStuff(pushups).total ?? 0,
                    numberSessions: getTodayStuff(pushups).sessions ?? 0,
                },
            },
        });
    }, [pushups, setStats]);

    const addThePushups = async (e, count) => {
        setLoading(true);
        e.preventDefault();
        e.currentTarget.blur();

        const pushupInfo = {
            count: count,
            created_at: new Date().toISOString(),
        };
        // Optimistically add pushup to UI
        const newPushupArray = [
            {
                data: pushupInfo,
                ts: new Date().getTime() * 10000,
            },
        ];

        const optimisticPushupState = newPushupArray.concat(pushups);

        setPushups(optimisticPushupState);

        try {
            const createResponse = await api.create(pushupInfo);
            console.log(createResponse);
            // remove temporaryValue from state and persist API response
            const persistedState = removeOptimisticStuff(pushups).concat(
                createResponse
            );
            // Set persisted value to state
            setPushups(persistedState);
        } catch (e) {
            console.log("An API error occurred", e);
            const revertedState = removeOptimisticStuff(pushups);
            // Reset to original state
            setPushups(revertedState);
        }
        setLoading(false);
    };

    const removePushup = (id) => {
        const pushupId = id;

        // Optimistically remove pushup from UI
        const filteredPushups = pushups.reduce(
            (acc, current) => {
                const currentId = getStuffId(current);
                if (currentId === pushupId) {
                    // save item being removed for rollback
                    acc.rollbackPushup = current;
                    return acc;
                }
                // filter deleted pushup out of the pushups list
                acc.optimisticState = acc.optimisticState.concat(current);
                return acc;
            },
            {
                rollbackPushup: {},
                optimisticState: [],
            }
        );

        setPushups(filteredPushups.optimisticState);

        api
            .delete(pushupId)
            .then(() => {
                console.log(`deleted pushup id ${pushupId}`);
            })
            .catch((e) => {
                console.log(`There was an error removing ${pushupId}`, e);
                // Add item removed back to list
                this.setState({
                    pushups: filteredPushups.optimisticState.concat(
                        filteredPushups.rollbackPushup
                    ),
                });
            });
    };

    const renderPushups = () => {
        if (!pushups || !pushups.length) {
            // Loading State here
            return null;
        }

        return pushups.map((pushup) => {
            const {data} = pushup;
            const id = getStuffId(pushup);

            const formattedDate = new Date(data?.created_at).toDateString();
            const formattedTime = new Date(data?.created_at).toLocaleTimeString();
            return (
                <tr key={id}>
                    <td>
                        {formattedDate}, {formattedTime}
                    </td>
                    <td>{data?.count}</td>
                    <td>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removePushup(id);
                            }}
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className={"grid grid--dashboard"}>
            <DashboardStats/>
            <section>
                <h3>Log a session!</h3>
            </section>
            <DashboardGraphs/>
            <DashboardProgress/>
            <section>
                <h3>Quick Add!</h3>
                <div className={"btn-group"}>
                    <button
                        className={loading ? "disabled" : ""}
                        onClick={(e) => addThePushups(e, 1)}
                    >
                        + 1
                    </button>
                    <button
                        className={loading ? "disabled" : ""}
                        onClick={(e) => addThePushups(e, 5)}
                    >
                        + 5
                    </button>
                    <button
                        className={loading ? "disabled" : ""}
                        onClick={(e) => addThePushups(e, 10)}
                    >
                        + 10
                    </button>
                    <button
                        className={loading ? "disabled" : ""}
                        onClick={(e) => addThePushups(e, 15)}
                    >
                        + 15
                    </button>
                    <button
                        className={loading ? "disabled" : ""}
                        onClick={(e) => addThePushups(e, 20)}
                    >
                        + 20
                    </button>
                </div>
            </section>
            <section>
                <h2>All of them!</h2>
                {pushups && (
                    <table className={"table table--responsive"}>
                        <thead>
                        <tr>
                            <th>Time & Date</th>
                            <th>Number</th>
                        </tr>
                        </thead>
                        <tbody>{renderPushups()}</tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
