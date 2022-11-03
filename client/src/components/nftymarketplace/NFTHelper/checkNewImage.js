import { ConnectWallet } from "../../nftyFunctions/ConnectWallet"
import { GetProvider } from '../../nftyFunctions/GetProvider'

import axios from 'axios';
import { fixURL, fixImageURL } from '../../nftyFunctions/fixURL'


export const handleNewImage = (tier, legendary, rare, common, coverArt) => {
    let image

    if (tier === 'Legendary' && legendary !== undefined) {
        image = legendary
    } else if (tier === 'Rare' && rare !== undefined) {
        image = rare
    } else if (tier === 'Common' && common !== undefined) {
        image = common
    } else {
      image = coverArt
    }

    return image

  }

export const checkIfNewImage = (liveMint, tier, legendary, rare, common) => {
    let image
    if (tier === 'Legendary' && legendary === undefined || tier === 'Legendary' && legendary === "") {
        return true
    } else if (tier === 'Rare' && rare === undefined || tier === 'Rare' && rare === "") {
        return true
    } else if (tier === 'Common' && common === undefined ||tier === 'Common' && common === "") {
        return true
    } else {
      return false
    }

  }


export const checkIfNewTokenURI = async(liveMint, tokenURI) => {
    let imageLink
    if (tokenURI !== "") {
      const meta = await axios.get(fixURL(tokenURI))
      for (const k in meta.data) {
          if ((meta.data[k]).toString().includes('ipfs')) {
              imageLink = meta.data[k]
            }
      }
    }

    if (liveMint.image !== imageLink) {
      return true
    } else {
      return false
    }
  }


