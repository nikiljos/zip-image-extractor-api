const axios=require('axios')
const jszip=require('jszip')
var mime = require('mime-types')

const extractApi=async(req,res)=>{
    let images=await getImages(req.query.url)
    .catch(err=>{
        res.status(400).send("Check URL my friend")
    })
    // console.log(images)
    res.send(images);

}


async function getImages(url){
    // let imgArray=[]
    // url="https://cdn.discordapp.com/attachments/970770954139607150/970945525081866270/nikiljos.zip"
    //get the zip file to client
    let images=await axios.get(url, { responseType: 'arraybuffer' }).then(async (res) => {
    // load contents into jszip and create an object
    // console.log(new Blob([res.data],{ type: 'application/zip' }));
        // console.log(res.data)
        let content= await jszip.loadAsync(res.data).then(async (zip) => {

            const zipObj = zip
            let imgArray=[]

            for(key of Object.keys(zipObj.files)){

                
                if(zipObj.files[key]._data){
                    let img=zipObj.files[key]
                    
                    if(img._data.compressedContent){
                        console.log(key)
                        let fileType=mime.lookup(key)
                        // console.log(fileType)
                        
                        // console.log(string64)
                        if(fileType.startsWith("image")){
                            await img.async("base64").then(function (string64) {
                                //send this image to a remote server as if it were a file
                                let imgURL=`data:${fileType};base64,${string64}`
                                // console.log(imgURL)
                                imgArray.push(imgURL)
                                // console.log(imgArray)

                            });
                            
                        }

                    }
                    
                }
            }
            // console.log(imgArray)
            return imgArray
        })
        // console.log(content)
        return content
        
        
    })
    .catch(err=>{
        throw err;
    })
    
    return images
   
    
}

module.exports={
    extractApi
}