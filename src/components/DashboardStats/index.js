import React, {useContext} from "react";
import DoingPushups from "../Animations/DoingPushupsIcon";
import {StatsContext} from "../Contexts/PushupsContext";

const DashboardStats = () => {
    const {stats} = useContext(StatsContext);

    return (
        <section>
            <h3>Stats <DoingPushups/></h3>
            <table className={"table table--responsive"}>
                <tbody>
                <tr>
                    <td>Owerall:</td>
                    <td>{stats.totalNumberPushups ?? 0}</td>
                </tr>
                <tr>
                    <td>Total sessions:</td>
                    <td>{stats.totalNumberSessions ?? 0}</td>
                </tr>
                <tr>
                    <td>Today total number:</td>
                    <td>{stats.today.numberPushups ?? 0}</td>
                </tr>
                <tr>
                    <td>Today total sessions:</td>
                    <td>{stats.today.numberSessions ?? 0}</td>
                </tr>
                <tr>
                    <td>Average per Day:</td>
                    <td>{stats.averagePerDay ?? 0}</td>
                </tr>
                <tr>
                    <td>Average per Week:</td>
                    <td>{stats.averagePerWeek ?? 0}</td>
                </tr>
                <tr>
                    <td>Average per Month:</td>
                    <td>{stats.averagePerMonth ?? 0}</td>
                </tr>
                </tbody>
            </table>
        </section>
    )

}

export default DashboardStats