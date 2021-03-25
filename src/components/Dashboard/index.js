import React, {useContext, useEffect, useState} from "react";
import {PushupsContext, StatsContext} from "../Contexts/PushupsContext";
import api from "../../utils/api";
import isLocalHost from "../../utils/isLocalHost";
import sortByDate from "../../utils/sortByDate";


function removeOptimisticPushup(pushups) {
    // return all 'real' pushups
    return pushups.filter((pushup) => {
        return pushup.ref
    })
}


function getPushupId(pushup) {
    if (!pushup.ref) {
        return null
    }
    return pushup.ref['@ref'].id
}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

const getStuffSum = (stuff) => stuff?.length !== 0 ? stuff.reduce((accum, {data: {count}}) => accum + parseInt(count, 10), 0) : false;

const getTodayStuff = (stuff) => {
    if (stuff.length === 0) {
        return 0;
    }

    return stuff.reduce((accum, {data: {count, created_at}}) => {
        if (isToday(new Date(created_at))) {
            return {
                total: accum.total + parseInt(count, 10),
                sessions: accum.sessions + 1,
            }
        }
        return accum;
    }, {total: 0, sessions: 0});
}

const Dashboard = () => {

    const [pushups, setPushups] = useContext(PushupsContext);
    const [stats, setStats] = useContext(StatsContext);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const resultPushups = await api.readAll();

            if (resultPushups.message === 'unauthorized') {
                if (isLocalHost()) {
                    alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
                } else {
                    alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
                }
                return false
            }
            setPushups(resultPushups);
        }

        fetchData();
    }, [setPushups]);

    useEffect(() => {
        setStats({
            type: "UPDATE_ALL",
            payload: {
                totalNumberPushups: getStuffSum(pushups),
                totalNumberSessions: pushups.length,
                today: {
                    numberPushups: getTodayStuff(pushups).total,
                    numberSessions: getTodayStuff(pushups).sessions,
                }
            }
        })
    }, [pushups, setStats]);

    const addThePushups = async (e, count) => {
        setLoading(true);
        e.preventDefault();
        e.currentTarget.blur();

        const pushupInfo = {
            count: count,
            created_at: new Date().toISOString(),
        }
        // Optimistically add pushup to UI
        const newPushupArray = [{
            data: pushupInfo,
            ts: new Date().getTime() * 10000
        }]

        const optimisticPushupState = newPushupArray.concat(pushups)

        setPushups(optimisticPushupState)

        try {
            const createResponse = await api.create(pushupInfo);
            console.log(createResponse)
            // remove temporaryValue from state and persist API response
            const persistedState = removeOptimisticPushup(pushups).concat(createResponse)
            // Set persisted value to state
            setPushups(persistedState)
        } catch (e) {
            console.log('An API error occurred', e)
            const revertedState = removeOptimisticPushup(pushups)
            // Reset to original state
            setPushups(revertedState)
        }
        setLoading(false);
    }

    const removePushup = (id) => {
        const pushupId = id;

        // Optimistically remove pushup from UI
        const filteredPushups = pushups.reduce((acc, current) => {
            const currentId = getPushupId(current)
            if (currentId === pushupId) {
                // save item being removed for rollback
                acc.rollbackPushup = current
                return acc
            }
            // filter deleted pushup out of the pushups list
            acc.optimisticState = acc.optimisticState.concat(current)
            return acc
        }, {
            rollbackPushup: {},
            optimisticState: []
        })

        setPushups(filteredPushups.optimisticState);

        api.delete(pushupId).then(() => {
            console.log(`deleted pushup id ${pushupId}`)
        }).catch((e) => {
            console.log(`There was an error removing ${pushupId}`, e)
            // Add item removed back to list
            this.setState({
                pushups: filteredPushups.optimisticState.concat(filteredPushups.rollbackPushup)
            })
        })
    }

    const renderPushups = () => {
        if (!pushups || !pushups.length) {
            // Loading State here
            return null
        }

        const timeStampKey = 'ts'
        const orderBy = 'desc' // or `asc`
        const sortOrder = sortByDate(timeStampKey, orderBy)
        const pushupsByDate = pushups.sort(sortOrder)

        return pushupsByDate.map((pushup, i) => {
            const {data} = pushup
            const id = getPushupId(pushup)

            const formattedDate = new Date(data?.created_at).toDateString();
            const formattedTime = new Date(data?.created_at).toLocaleTimeString();
            return (
                <tr key={id}>
                    <td>{formattedDate}, {formattedTime}</td>
                    <td>{data?.count}</td>
                    <td><span onClick={() => {
                        removePushup(id);
                    }}>Remove</span></td>
                </tr>
            )
        })
    }

    return (
        <div className={"grid grid--dashboard"}>
            <section>
                <h3>Stats</h3>
                <table className={"table table--responsive"}>
                    <tbody>
                    <tr>
                        <td>Owerall:</td>
                        <td>{stats.totalNumberPushups}</td>
                    </tr>
                    <tr>
                        <td>Total sessions:</td>
                        <td>{stats.totalNumberSessions}</td>
                    </tr>
                    <tr>
                        <td>Today total number:</td>
                        <td>{stats.today.numberPushups}</td>
                    </tr>
                    <tr>
                        <td>Today total sessions:</td>
                        <td>{stats.today.numberSessions}</td>
                    </tr>
                    </tbody>
                </table>
            </section>
            <section>
                <h3>Start a session!</h3>

            </section>
            <section>
                <h3>Graphs!</h3>
            </section>
            <section>
                <h3>Quick Add!</h3>
                <div className={'btn-group'}>
                    <button className={loading ? "disabled" : ""} onClick={(e) => addThePushups(e, 1)}>+ 1</button>
                    <button className={loading ? "disabled" : ""} onClick={(e) => addThePushups(e, 5)}>+ 5</button>
                    <button className={loading ? "disabled" : ""} onClick={(e) => addThePushups(e, 10)}>+ 10</button>
                    <button className={loading ? "disabled" : ""} onClick={(e) => addThePushups(e, 15)}>+ 15</button>
                    <button className={loading ? "disabled" : ""} onClick={(e) => addThePushups(e, 20)}>+ 20</button>
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
                        <tbody>
                        {renderPushups()}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default Dashboard;