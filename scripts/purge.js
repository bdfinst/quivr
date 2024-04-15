const BRAIN_ID = '7f5bac72-991e-4483-b9ba-84282c0d144a'

const purgeContent = () => {
  fetch(`http://localhost:5050/knowledge?brain_id=${BRAIN_ID}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer 539a9466049322081b0023ccd8472d89',
    },
  })
    .then(response => response.json())
    .then(data => {
      data.knowledges.forEach(item => {
        fetch(
          `http://localhost:5050/knowledge/${item.id}?brain_id=${BRAIN_ID}`,
          {
            method: 'DELETE',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer 539a9466049322081b0023ccd8472d89',
            },
          }
        )
          .then(response => response.json())
          .then(data => console.log(data.message))
          .catch(error => console.error('Error:', error))
      })
    })
    .catch(error => console.error('Error:', error))
}

purgeContent()
