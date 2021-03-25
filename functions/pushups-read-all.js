/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context) => {
    console.log('Function `pushup-read-all` invoked')
    /* configure faunaDB Client with our secret */
    const client = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET
    })

    try {
        const response = await client.query(q.Paginate(q.Match(q.Ref('indexes/all_pushups'))));

        const pushupRefs = response.data
        console.log('pushup refs', pushupRefs)
        console.log(`${pushupRefs.length} pushups found`)
        // create new query out of pushup refs. http://bit.ly/2LG3MLg
        const getAllPushupDataQuery = pushupRefs.map((ref) => {
            return q.Get(ref)
        })
        // then query the refs
        return client.query(getAllPushupDataQuery).then((ret) => {
            return {
                statusCode: 200,
                body: JSON.stringify(ret)
            }
        })
    } catch (error) {
        console.log('error', error)
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}
