import React, { useState, useEffect } from "react";
import store from "../redux/store";
import { useSelector, useDispatch, Provider } from "react-redux";
import { login } from "../redux/loginSlice";
import { makePublicRouterInstance, useRouter } from "next/router";
import Link from "next/link";
import { changeNumber } from "../redux/userSlice"
interface loginState {
	email: string,
	password: string,
	isLoggedIn: boolean,
	loginErr: boolean
};

interface postState {
	url: null | string,
	object: null | object
};

const LoginComponent: React.FunctionComponent<{}> = () => {
	const [state, getState] = useState<loginState>({
		email: "",
		password: "",
		isLoggedIn: false,
		loginErr: false
	});

	useEffect(() => {
		state.isLoggedIn = loginState;
		if (state.isLoggedIn) {
			router.push("/home");
		}
	}, []);

	const loginState = useSelector((state: any) => state.login.value );
	const dispatch = useDispatch();

	const router = useRouter();

	const signUpUser = (event: any) => {
		event.preventDefault()
		const url = `http://localhost:4000/api/login?email=${state.email}&password=${state.password}`;
		fetch(url)
		.then((response: any) => {
			if (response.status === 200) {
				console.log(response)
				return response.json()
			} else if (response.status === 500) {
				state.isLoggedIn = false
				state.loginErr = true
				return
			}
		})
		.then(data => {
			if (data) {
				state.isLoggedIn = true
				dispatch(login());
				dispatch(changeNumber(data.userNumber));
				router.push("/home");
			}
		})
		.catch(err => {
			state.isLoggedIn = false;
			state.loginErr = true;
		});
	}

	return(
		<div> 
			{state.loginErr ? <h2>error whilst logging in, please try again</h2> : null}
			<form>
				<div>
					<label>email</label><br />
					<input type="text" placeholder="email" value={state.email} onChange={(e) => {getState({
						email: e.target.value,
						password: state.password,
						isLoggedIn: state.isLoggedIn,
						loginErr: state.loginErr
					})}}></input>
				</div>
				<div>
					<label>password</label><br />
					<input type="password" placeholder="password" value={state.password} onChange={(e) => {
						getState({
							email: state.email,
							password: e.target.value,
							isLoggedIn: state.isLoggedIn,
							loginErr: state.loginErr
						});
					}}></input>
				</div>

				<button onClick={signUpUser}>login</button>
			</form>

			<Link href="/signup">
				<a>create new account</a>
			</Link>

		</div>
	)
}


const Login: React.FunctionComponent<{}> = () => {
	return(
		<div>
			<Provider store={store}>
				<LoginComponent />
			</Provider>
		</div>
	)
}


export default Login;



