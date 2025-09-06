const multer=require('multer');
const path=require('path');
//Set storage engine
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});
const fileFilter=(req,file,cb)=>{
    //Accept only certain file types
    const allowedFileTypes=['image/jpeg','image/jpg','image/png','application/pdf'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'),false);
    }
}