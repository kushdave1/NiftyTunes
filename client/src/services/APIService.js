import React from 'react'

export default class APIService{
    
    static UploadMedia(body){
        return fetch(`http://localhost:5000/upload`,{
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
