import axios from "axios";
import { User } from "../model";

type RequestSignUpService = {
    email : string;
    firstName : string;
    lastName : string;
    organization : string;
    phone : string;
    password : string;
    //createUserKey  - KORAT-KOS-256
}

type ResponseSignUpService = {
    access_token: string;
    user: User;
}

export async function SignUpService(
    input : RequestSignUpService
): Promise<ResponseSignUpService> {
    try {
        const signUp = await axios({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/auth/sign-up`,
            data: {...input},
            headers: {
                "Content-Type" : "application/json",
            },
        })
        return signUp.data;
    } catch (error: any) {
        console.error(error.response.data);
        throw error?.response?.data;
    }
}