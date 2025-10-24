import {email, z} from "zod";
export const signInSchema=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be atleast 8 characters long"),
})
export const signUpSchema=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be 8 characters long"),
    confirmPassword:z.string().min(8,"Password must be atleast 8 characters long")
})