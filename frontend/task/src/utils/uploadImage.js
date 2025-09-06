import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosinstance";
const uploadImage=async(imageFile)=>{
    const formData=new FormData();
    formData.append("image",imageFile);
    try{
        const response=await axiosInstance.post(API_PATHS.UPLOAD_IMAGE,formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        return response.data;
    }catch(error){
        console.error("Image upload failed:",error);
        throw error;
    }
}

export default uploadImage;