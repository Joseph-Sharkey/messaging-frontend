import React, { useState, useEffect } from "react";
import store from "../redux/store";
import { useRouter } from "next/router";
import { useSelector, useDispatch, Provider } from "react-redux";
import { login } from "../redux/loginSlice";
const basicRequestObject: any = require("../components/basicRequestObject");

interface loginState {
	email: string,
	password: string,
	isLoggedIn: boolean,
	loginError: boolean
}

const SignUpComponent: React.FunctionComponent<{}> = () => {
	const [state, getState] = useState<loginState>({
		email: "",
		password: "",
		isLoggedIn: false,
		loginError: false
	});

	const router = useRouter();
	const loginState = useSelector((state: any) => state.login.value);
	const dispatch = useDispatch();

	function signUpUser() {
		const data = {email: state.email, password: state.password}
		const requestObject = basicRequestObject(data)
		const url = "http://localhost:4000/api/newaccount";
		console.log("fetching");
		fetch(url, requestObject)
		.then(response => {
			console.log("response recieved")
			console.log(response)
			if (response.status === 200) {
				console.log("new account creation successful")
				state.isLoggedIn = true
				setTimeout(() => {
					router.push("/login")
				}, 2000)
			} else if (response.status === 500) {
				console.log("status not equal to 200")
				state.isLoggedIn = false
				state.loginError = true
			}
		})
		.catch(() => {
			console.log("there was an error")
			state.isLoggedIn = false;
			state.loginError = true;
		})
	}

	return(
		<div>
			<h1>create new account</h1>
			{state.loginError ? <h2>error loggin in: user credentials already taken</h2> : null}
			<form>
				<div>
					<label>email</label><br />
					<input type="text" placeholder="email" value={state.email} onChange={(e) => {getState({
						email: e.target.value,
						password: state.password,
						isLoggedIn: state.isLoggedIn,
						loginError: false 
					})}}></input>
				</div>

				<div>
					<label>password</label><br />
					<input type="password" placeholder="password" value={state.password} onChange={(e) => {
						getState({
							email: state.email,
							password: e.target.value,
							isLoggedIn: state.isLoggedIn,
							loginError: false //after error, the user can attempt to sign in again and error message will disappear
						});
					}}></input>
				</div>
			</form>
			<button onClick={signUpUser} >create new account</button>
			<div>
				{state.loginError ? <h1>your account has now been created and you will be returned to the login page to log in</h1> : null}
			</div>
		</div>
	);
};

const SignUp = () => {
	return(
		<Provider store={store}>
			<SignUpComponent />
		</Provider>
	)
}


export default SignUp;
