import { useSelector, useDispatch, Provider } from "react-redux";
import { useState } from "react";
const basicRequestObject = require("../components/basicRequestObject");
import store from "../redux/store"; //if this is imported with a 'require', more code would be required to initialise it for some reason
import { useRouter } from "next/router";
import {changeUsername, changeDescription} from "../redux/userSlice";
interface details {
	username: string,
	description: string
}

const CreateNewAccountComponent = () => {
	const userNumber = useSelector((state: any) => state.user.userNumber);
	const router = useRouter();
	const dispatch = useDispatch()
	const [details, getDetails] = useState<details>({
		username: "",
		description: ""
	});

	let noDetails = false
	let requestError = false

	function makeNewAccount() {
		if (details.username === "" || details.description==="") {
			setTimeout(() => {
				noDetails = true;
			}, 3000);
			noDetails = false;
		} else {
			const data = {
				username: details.username,
				description: details.description,
				userNumber: userNumber
			}
			const reqObject = basicRequestObject(data)
			const url = "http://localhost:5000/api/createNewUser"
			fetch(url, reqObject)
			.then(response => {
				if (response.status === 200) {
					dispatch(changeUsername(details.username))
					dispatch(changeDescription(details.description))
					router.push("/home");
				} else {
					setTimeout(() => {
						requestError = false
					}, 3000);
				};
			});

		}
	} 
	
	return(
		<div>
			<h1>create your account</h1>
			<div>
				<label>username</label>
				<input type="text" placeholder="your name" value={details.username} onChange={(e:any) => getDetails({username: e.target.value, description: details.description})}></input>
			</div>
			<div>
				<label>description</label>
				<input type="text" placeholder="your description" value={details.description} onChange={(e:any) => getDetails({username: details.username, description: e.target.value})}></input>
			</div>
			<div>
				<button onClick={makeNewAccount} >Create Account</button>
			</div>
			<div>
				{noDetails ? <h2>You haven&apos;t input a username and password</h2> : null} 
				{requestError ? <h2>There was an error whilst creating your account</h2> : null}
			</div>
		</div>

	);
};
const createNewAccount = () => {
	return(
		<Provider store={store}>
			<CreateNewAccountComponent />
		</Provider>
	)
}

export default createNewAccount;