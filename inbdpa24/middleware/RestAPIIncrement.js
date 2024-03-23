const https = require('https');
module.exports = {
     incrementWithBearerToken:  function  (url, token) {
      fetch(url, {
  method: 'PATCH',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"views":"increment"})
}) 
.then(response => response.json())
.then(data =>  { console.log("patch",data)
               return data})

.catch(error => console.error(error))
    }
    };