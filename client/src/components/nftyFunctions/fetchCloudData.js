import Moralis from 'moralis';
import { APP_ID, SERVER_URL } from '../../index'

export const fetchArtistPhoto = async(artist) => {

    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    Moralis.start({ serverUrl, appId});
    
    const data = await Moralis.Cloud.run("artistPhoto")
      for (const i in data) {
        const object = data[i]
        if (typeof(artist) === "string" && typeof(object.get("ethAddress")) === "string") {
          if (artist.toLowerCase()===object.get("ethAddress").toLowerCase()) {
            const profilePhotoURL = await object.get("profilePhotoURL")
            return profilePhotoURL
          }
        }
        
      }
  }

export const fetchArtistName = async(artist) => {

    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    Moralis.start({ serverUrl, appId});

    const data = await Moralis.Cloud.run("artistPhoto")
        for (const i in data) {
        const object = data[i]
        if (typeof(artist) === "string" && typeof(object.get("ethAddress")) === "string") {
            if (artist.toLowerCase()===object.get("ethAddress").toLowerCase()) {
            const profileName = await object.get("username")
            return profileName
            }
        }
        
        }
}