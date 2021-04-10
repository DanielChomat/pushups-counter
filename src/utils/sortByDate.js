export default function sortDate(order) {
    return function (a, b) {
        const timeA = new Date(a.data.created_at).getTime()
        const timeB = new Date(b.data.created_at).getTime()
        if (order === 'asc') {
            return timeA - timeB
        }
        // default 'desc' descending order
        return timeB - timeA
    }
}
