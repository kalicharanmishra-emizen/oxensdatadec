// check file is required
isFileReq=val=>{
    if (!val) {
        return false;
    }else{
        return true;
    }
}
// check file mimetype is given or not
isMimeType=(val,mimetype)=>{
    let ext=val.mimetype.split('/').pop()
    if (mimetype.includes(ext)) {
        return true;
    }else{
        return false;
    }
}
// check file size
isFileSize=(val,size)=>{
    if (val.size > size) {
        return false;
    } else {
        return true;
    }
}
module.exports={isFileReq,isMimeType,isFileSize}