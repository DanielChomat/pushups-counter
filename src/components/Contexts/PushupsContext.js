import * as React from 'react'
import {useReducer, useState} from 'react'

const defaultValues = {
    totalNumberPushups: 0,
    totalNumberSessions: 0,
    averagePerDay: 0,
    averagePerMonth: 0,
    today: {
        numberPushups: 0,
        numberSessions: 0,
    }
}

const defaultValuesFnc = () => (defaultValues)

const statsReducer = (state, action) => {
    console.log(state);
    console.log(action);

    switch (action.type) {
        case "UPDATE_ALL" :
            return {
                ...state,
                totalNumberPushups: action.payload.totalNumberPushups,
                totalNumberSessions: action.payload.totalNumberSessions,
                today: {
                    numberPushups: action.payload.today.numberPushups,
                    numberSessions: action.payload.today.numberSessions,
                }
            }
        default :
            return state;
    }
}

const PushupsContext = React.createContext([[], () => {
}]);
const StatsContext = React.createContext([defaultValues, () => {
}]);

const ContextProvider = ({children}) => {
    const [pushups, setPushups] = useState([]);
    const [state, dispatch] = useReducer(statsReducer, defaultValues, defaultValuesFnc);

    return (
        <PushupsContext.Provider value={[pushups, setPushups]}>
            <StatsContext.Provider value={[state, dispatch]}>
                {children}
            </StatsContext.Provider>
        </PushupsContext.Provider>
    );
}

export {PushupsContext, ContextProvider, StatsContext};