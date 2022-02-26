import React from 'react'

export default class APIService{
    
    static MixMedia(body){
        return fetch(`http://localhost:5000/mix`,{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
      },
      body:JSON.stringify(body)
    })
    .then(response => response.json())
    .catch(error => console.log(error))
    }
}
