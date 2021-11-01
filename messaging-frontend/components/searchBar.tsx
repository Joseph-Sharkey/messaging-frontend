//this component has been written and therefore we need to ensure that the homepage can response to it 

import {useState} from "react";
const basicRequestObject = require("./basicRequestObject");
interface Props {
	userNumber: string
};

interface chatDetails {
	chatName: string,
	chatDescription: string
};


const FriendRequestForm = (props: any) => {
	const [details, changeDetails] = useState<chatDetails>({
		chatName: "",
		chatDescription: "" 
	});
	return(
		<div>
			<h2>friend request to {props.name}</h2>
			<label>chat name</label><br />
			<input type="text" placeholder="chat name" value={details.chatName} onChange={(e) => changeDetails({chatName: e.target.value, chatDescription: details.chatDescription})}></input><br />
			<label>chat description</label><br />
			<textarea placeholder="description" value={details.chatDescription} onChange={(e) => changeDetails({chatName: details.chatName, chatDescription: e.target.value})}></textarea><br />
			<button onClick={() => {props.requestFunction(details.chatName, details.chatDescription)}}>Make Friend Request</button>
		</div>
	);
};


const SearchBar = (props: Props) => {
	const [inputNumber, getInputNumber] = useState<any>("")
	const [userFound, getUserFound] = useState<null|string>(null);
	const [userInfo, getUserInfo] = useState<any>({
		user_number: null,
		username: null,
		description: null,
		created_on: null
	});
	const [error, getError] = useState<boolean>(false)

	function findUser(numberToFind: number) {
		//this will need two separate calls to database so we can establish:
		//1. whether user exists
		// then 2 what the user proposed for the chat name and description
		const url = `http://localhost:5000/api/findUser?userNumber=${numberToFind}`;
		fetch(url)
		.then(response => {
			if (response.status === 200) {
				getError(false)
				getUserFound("user")
				return response.json()
			} else {
				getError(true)
			}
		})
		.then(dataObject => {
			if (dataObject) {
				getUserInfo(dataObject)
			}
		})
	}

	let successfulFriendRequest = false


	function makeFriendRequest(chatName: string, chatDescription: string) {
		if (chatDescription.length > 50) {
			throw("chat description length cannot be more than 50 sorry i accidentally set this and now i can't change it ")
		}
		const dataObject = {
			requestedNumber: inputNumber,
			userNumber: props.userNumber,
			proposedChatName: chatName,
			proposedChatDescription: chatDescription 
		}
		const requestObject = basicRequestObject(dataObject);
		const url = "http://localhost:5000/api/createFriendRequest"
		fetch(url, requestObject)
		.then(response => {
			if (response.status===200) {
				getUserFound(null);
				setTimeout(() =>{
					successfulFriendRequest = true
				}, 3000)
				
			} else {
				getUserFound(null)
				getError(true)
			}
		})
		.catch(err => {
			getUserFound(null)
			getError(true)
		})
	}

	return(
		<div>
			<div>
				<input type="text" placeholder="search for other users" value={inputNumber} onChange={(e:any) => {getInputNumber(e.target.value)}}/>
			</div>
			<button onClick={() => findUser(inputNumber)}>Find User</button>
			{(userFound === "user") ? <div>
				<h2>found: </h2>
				<h3>{userInfo.username}</h3>
				<div>
					<p>{userInfo.description}</p>
				</div>
				<div>
					<button onClick={() => getUserFound("form")} >Make friend Request</button>
				</div>
			</div>: null}
			{(userFound==="form") ? 
				<FriendRequestForm name={userInfo.username} requestFunction={makeFriendRequest}/>		
			: null
			}

			{error ? 
				<div>
					<h2>error whilst fetching data</h2>
					<button onClick={() => getError(false)}>Hide Error</button>
				</div>
			: null
			}

			{successfulFriendRequest ? <h2>Friend Request Successful!</h2> : null}

		</div>
	);
};

export default SearchBar;