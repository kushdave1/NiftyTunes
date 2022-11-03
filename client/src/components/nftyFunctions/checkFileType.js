import { fixURL } from  './fixURL.js'

export const checkFileType = async(image) => {
    console.log(image, "FREEDOM")
    if (image.toString().includes('png') || image.toString().includes('gif') || image.toString().includes('jpg') || 
              image.toString().includes('jpeg')) {
                  return "image/png"
              } else {
                  let file = fixURL(image)
                const req = await fetch(file, {method: "HEAD"})
                console.log(req.headers.get("content-type"), "FLS")
                return req.headers.get("content-type")
              }

}