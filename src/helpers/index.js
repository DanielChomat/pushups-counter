import moment from "moment";
import {MOMENT_DAY_SLUG} from "../constants";

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

const getTotalDonePer = (stuff, diffEntity) => {
    if (stuff.length === 0) {
        return false;
    }

    const firstDay = moment(stuff[0].data.created_at);
    const lastDay = moment(stuff.slice(-1).pop().data.created_at);

    console.log(diffEntity);
    console.log(firstDay.diff(lastDay, diffEntity, true));

    const difference = Math.round(Math.abs(firstDay.diff(lastDay, diffEntity, true)));

    return difference !== 0 ? difference : 1;
}

const getDailyStuff = (stuff) => {
    if (stuff.length === 0) {
        return 0;
    }

    return Math.round(getStuffSum(stuff) / getTotalDonePer(stuff, MOMENT_DAY_SLUG));
}

const getWeeklyStuff = (stuff) => {
    if (stuff.length === 0) {
        return 0;
    }

    const firstWeek = moment(stuff.slice(-1).pop().data.created_at).isoWeek();
    const lastWeek = moment(stuff[0].data.created_at).isoWeek();

    const diff = lastWeek - firstWeek + 1;

    return Math.round(getStuffSum(stuff) / diff);
}

const getMonthlyStuff = (stuff) => {
    if (stuff.length === 0) {
        return 0;
    }

    const firstMonth = moment(stuff.slice(-1).pop().data.created_at).month() + 1;
    const lastMonth = moment(stuff[0].data.created_at).month() + 1;

    const diff = lastMonth - firstMonth + 1;

    return Math.round(getStuffSum(stuff) / diff);
}

export {
    isToday,
    getStuffSum,
    getTodayStuff,
    getTotalDonePer,
    getDailyStuff,
    getWeeklyStuff,
    getMonthlyStuff
}