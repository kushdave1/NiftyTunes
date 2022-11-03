import Moralis from 'moralis'
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup'
import { useFilterGallery } from "../../../providers/GalleryProvider/FilterGalleryProvider";
import { APP_ID, SERVER_URL } from "../../../index"
import { useState, useEffect } from "react"
import { checkFileType } from '../../nftyFunctions/checkFileType'


function ArtistFilter() {
    const { galleryTokenIds, setGalleryTokenIds, fullTokenIds, setFullTokenIds }  = useFilterGallery()

    const [artistName, setArtistName] = useState([])

    const filterArtist = async(artist) => {
        let items = []
        for (const i in fullTokenIds) {
            if (fullTokenIds[i].artistName === artist) {
                items.push(fullTokenIds[i])
                console.log(items, "PEAM")
            }
        }

        items = items.slice(0,12)

        setGalleryTokenIds(items)
        

        

        // for (const i in data) {
        //     const object = data[i];
      
        //     let image = object.get("image")
      
      
        //     // const meta = await axios.get(fixURL(object.get("tokenURI")))
        //     // for (const j in meta.data) {
        //     //   if ((meta.data[j]).toString().includes('ipfs')) {
        //     //       imageLink = meta.data[j]
        //     //   }
        //     // }
      
        //     const fileType = await checkFileType(image)
        //     let item = {
        //       fileType: object.get("fileType"),
      
        //       tokenId: object.get("tokenId"),
        //       artist: object.get("artist"),
        //       owner: object.get("owner"),
        //       artistPhoto: object.get("artistPhoto"),
        //       artistName:  object.get("artistName"),
        //       ownerPhoto: object.get("owner"),
        //       ownerName: object.get("ownerName"),
        //       coverPhotoURL: object.get("coverPhotoURL"),
        //       gallery: object.get("galleryAddress"),
        //       image: image,
        //       isSold: false,
        //       name: object.get("name"),
        //       description: object.get("description"),
        //       tier: object.get("tier"),
        //       location: object.get("location"),
        //       date: object.get("date"),
        //       mintAddress: object.get("mintAddress"),
        //       signerAddress: object.get("signerAddress")
              
        //     }
        //     items.push(item)
        //   }

          


        
    }



    const getArtistNames = async() => {
        const appId = APP_ID;
        const serverUrl = SERVER_URL;   
        Moralis.start({ serverUrl, appId});

        const LiveNFTs = await Moralis.Object.extend("LiveNFTs");

        const query = new Moralis.Query(LiveNFTs)
        const data = await query.find()
        console.log(data, "DIRP")
        let artistNames = []
        let artist

        for (const i in data) {
            artist = data[i].get("artistName")
            console.log(artistNames.length, "PROP")
            if (artistNames.length > 0) {
                if (!artistNames.includes(artist)) {
                    artistNames.push(artist)
                }
            } else {
                artistNames.push(artist)
            }
        }

        return artistNames

    }

    useEffect(async() => {
        const artistNames = await getArtistNames()
        console.log(artistNames, "DORP")
        setArtistName(artistNames)
    }, [])

    return (
        <ArtistFilterSection>
            <Dropdown.Toggle className="btn" style={{background: "none", border: "none", width: "100%"}}>
                Artist
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <ListGroup>
                    {artistName && artistName.map((artist, index) => 
                        <Row className="px-2">
                            <Col xs="2">
                                <input type="checkbox" style={{borderRadius: "2rem"}} onClick={() => filterArtist(artist)}/>
                            </Col>
                            <Col>
                                <p>{artist}</p>
                            </Col>
                        </Row>
                    )}
                    
                    
                </ListGroup>
            </Dropdown.Menu>
        </ArtistFilterSection>
    )
}

export default ArtistFilter;

const ArtistFilterSection = styled(Dropdown)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;

`