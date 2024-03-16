const axios=require('axios')
const jszip=require('jszip')
var mime = require('mime-types')

const healthCheck=(req,res)=>{
    res.status(200).send({
        success:true,
        message:"Server is running!"
    })
}

const extractApi=async(req,res)=>{
    let images=await getImages(req.query.url)
    .catch(err=>{
        res.status(400).send(err.message)
    })
    res.send(images);
}


async function getImages(url){

    // url="https://cdn.discordapp.com/attachments/970770954139607150/970945525081866270/nikiljos.zip"
    let images=await axios.get(url, { responseType: 'arraybuffer',maxContentLength:3*1000*1000 }).then(async (res) => {
        // load contents into jszip and create an object
        let content= await jszip.loadAsync(res.data).then(async (zip) => {

            const zipObj = zip
            let imgArray=[]
            console.log(zipObj)
            for(key of Object.keys(zipObj.files)){

                
                if(zipObj.files[key]._data){
                    let img=zipObj.files[key]
                    
                    if(img._data.compressedContent){
                        console.log(key)
                        let fileType=mime.lookup(key)
                        if(fileType&&fileType.startsWith("image")){
                            await img.async("base64").then(function (string64) {
                                let imgURL=`data:${fileType};base64,${string64}`
                                imgArray.push(imgURL)
                            });
                            
                        }

                    }
                    
                }
            }
            return imgArray
        })
        return content        
    })
    .catch(err=>{
        throw err;
    })
    
    return images
   
    
}

module.exports={
    extractApi,
    healthCheck
}