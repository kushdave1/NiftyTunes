import { fixURL } from  './fixURL.js'

export const checkFileType = async(image) => {
    if (image.toString().includes('png') || image.toString().includes('gif') || image.toString().includes('jpg') || 
              image.toString().includes('jpeg') || image.toString().includes('usemoralis')) {
                  return "image/png"
              }
    let file = fixURL(image)
    const req = await fetch(file, {method: "HEAD"})
    return req.headers.get("content-type")

}