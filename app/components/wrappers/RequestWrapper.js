export default function MakePOST (route, payload, onComplete) {
    const targetRoute = "/"+route;
    fetch(targetRoute, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
       })
     .then(response => response.json())
     .then(data => {
         onComplete(data);
     })
     .catch(console.log)
}