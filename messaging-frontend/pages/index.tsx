import Head from 'next/head';
import Link from 'next/link';
import { useState } from "react"
import { useEffect } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import store from "../redux/store"
import { useRouter } from "next/router";
import {login, logout } from "../redux/loginSlice";



function AppComponent() {
    const [data, setData] = useState([]);

    const dispatch = useDispatch();
    const loginState = useSelector((state: any) => state.login.value);
    const router = useRouter();

    useEffect(() => {
        const url = "http://localhost:4000/api/refreshlogin";
        const reqObject = {
            method: "GET",
            withCredentials: true,
            headers: {
				"Accept": "application/json",
				"content-Type": "application/json",
                "credentials": "include"
			},
            
        }
        fetch(url, reqObject)
        .then(response => {
            if (response.status === 200) {
                dispatch(login())
                router.push("/home");
            } else {
                dispatch(logout());
            }
        })
        .catch(err => {
            dispatch(logout());
        })
    }, [])


    const getData = () => {

        //request the data to show on this page
    }
 return(
     <div>
        <h1 className="h1">Welcome to Messenger</h1>
            <div className="button">
            <Link href="/login">
                 <a>Login</a>
            </Link>
            </div>
        <h2>Written By Me</h2>
     </div>
 );
}



export default function App() {
    return(
        <Provider store={store}>
            <AppComponent />
        </Provider>
    )
}
//this page will also contain some content from the sources but it will be generic instead of user specific
