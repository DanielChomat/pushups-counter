/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/pushups-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAll = () => {
  return fetch('/.netlify/functions/pushups-read-all').then((response) => {
    return response.json()
  })
}

const update = (pushupId, data) => {
  return fetch(`/.netlify/functions/pushups-update/${pushupId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deletePushup = (pushupId) => {
  return fetch(`/.netlify/functions/pushups-delete/${pushupId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

const batchDeletePushup = (pushupIds) => {
  return fetch(`/.netlify/functions/pushups-delete-batch`, {
    body: JSON.stringify({
      ids: pushupIds
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export default {
  create: create,
  readAll: readAll,
  update: update,
  delete: deletePushup,
  batchDelete: batchDeletePushup
}
