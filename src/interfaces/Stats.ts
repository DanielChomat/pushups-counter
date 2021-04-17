export interface Stats {
    totalNumberPushups: number | boolean;
    totalNumberSessions: number | boolean;
    averagePerDay: number | boolean;
    averagePerWeek: number | boolean;
    averagePerMonth: number | boolean;
    today: {
        numberPushups: number | boolean;
        numberSessions: number | boolean;
    }
}
