import {useState, useEffect} from "react";
const basicRequestObject = require("./basicRequestObject");

interface Props {
	userNumber: number
}

interface FriendRequest {
	request_id: number,
	from_user: number,
	to_user: number,
	time_sent: any,
	proposed_name: string,
	proposed_description: string,
	user_id: number,
	username: string,
	description: string,
	created_on: any,
	accepted: any
}

interface friendRequestProps {
	data: FriendRequest,
	acceptFunction: any
}

const FriendRequest = (props: friendRequestProps) => {
	return (
		<div key={props.data.request_id}>
			<h2>From {props.data.username}</h2>
			<h3>Chat name: {props.data.proposed_name}</h3>
			<h3>Chat description: {props.data.proposed_description}</h3>
		<div>
			<button onClick={props.acceptFunction}>Accept</button>
		</div>
		</div>	
	)
}



const addChatMemberFunction = (userNumber: number, chatNumber: number) => {
	return new Promise(function(resolve, reject) {
		const fetchData = {
			userNumber: userNumber,
			chatNumber: chatNumber 
		}
		const requestObject = basicRequestObject(fetchData)
		const url = "http://localhost:5000/api/addChatMember"
		fetch(url, requestObject)
		.then(response => {
		if(response.status === 200) {
			return true
		} else {
			reject(false)
		}
		});
	});
}

const deleteFriendRequestFunction = (userNumber: number, fromUser: number) => {
	return new Promise(function(resolve, reject) {
		const deleteData = {
			userNumber: userNumber,
			fromUser: fromUser 
		}
		const deleteRequestObject = basicRequestObject(deleteData)
		const url  = "http://localhost:5000/api/deleteFriendRequest"
		fetch(url, deleteRequestObject)
		.then(response => {
			if(response.status===200) {
				return true
			} else{
				throw(false)
			}
		})
	})
}

const createNewChatFunction = (requestId: number, userNumbers: Array<number>, chatName: string, chatDescription: string) => {
	return new Promise(function(resolve, reject) {
		const url = "http://localhost:5000/api/createChat"
		const dataObject = {
			chatNumber: requestId,
			userNumbers: userNumbers,
			chatName: chatName,
			chatDescription: chatDescription 
		};
		const requestObject = basicRequestObject(dataObject)
		fetch(url, requestObject)
		.then(response => {
			if (response.status === 200) {
				resolve(true)
			} else {
				resolve(false)
			}
		})
	})
}

const FriendRequestBar = (props: Props) => {
	const [friendRequests, getFriendRequestsData] = useState<any>(null)
	const [noRequests, getNoRequests] = useState(false);
	const [error, getError] = useState(false);
	const [successfulRequest, getSuccessfulRequest] = useState(false);
	useEffect(() => {
		fetchFriendRequests()
		.then(data => {
		})
		.catch(err => {
			console.log(err)
		})
	}, [])
	//this is a test
	function fetchFriendRequests() {
		return new Promise(function(resolve, reject) {
		const url = `http://localhost:5000/api/checkFriendRequest?userNumber=${props.userNumber}`
		fetch(url)
		.then(response => {
			return response.json()
		})
		.then((dataObject: any) => {
			if (dataObject.data !== []) {
				getFriendRequestsData(dataObject.data);
				// <===== THIS DOES NOT WORK AND I DO NOT KNOW WHY SO DO MORE OF THIS TOMMORROW
				getSuccessfulRequest(true);
				resolve(true);
			}
			else {
				console.log("you have no friend requests")
				getNoRequests(true);
				resolve(false); //these serve no purpose and are here to adhere to promise schema
			}
		})
		.catch(err => {
			reject(err)
		})
	})
	}

	const [successfulAccept, getSuccessfulAccept] = useState(false)

	function acceptRequest(request_id: number, from_user: number, proposedChatName: string, proposedChatDescription: string, chatNumber: null|number, ) {
		const isGroupChat = chatNumber ? true : false //if there is a chatnumber, that means that the request came from a group chat 
		let fromUser: null|number = from_user
		if (isGroupChat) {
			fromUser = chatNumber
		}
		const url = `http://localhost:5000/api/acceptFriendRequest?to_user=${props.userNumber}&from_user=${fromUser}&isGroupChat=${isGroupChat}` // the chat number will be sent as the from_user number in lieu of the number from the person making the request
		fetch(url)
		.then(response => {
			return response.json()
		})
		.then(dataObject => {
			console.log(dataObject.data)
			if(dataObject.data) {
				console.log("adding members to group chat")
				//in theory, dataObject.data is just the chat number
				return addChatMemberFunction(props.userNumber, dataObject.data)
			} else {
				console.log("creating group chat")
				return createNewChatFunction(request_id, [props.userNumber, from_user], proposedChatName, proposedChatDescription)
			}
		})
		.then(responseData => {
			if (responseData) {
				getSuccessfulAccept(true)
				setTimeout(() => {
					getSuccessfulAccept(false)
				}, 2000)
				fetchFriendRequests()
			} else {
				getError(false)
			}
		})
		.catch(err => {
			console.log("there was an error")
			getError(true);
		})
	}

	return(
		<div>
			<h2>friend requests</h2>
			{noRequests ? <h2>you don't have any friend requests</h2> : null}
			{successfulAccept ? <h2>you have accepted the request</h2> : null}
			{error ? <h2>there was an error whilst fetching data</h2>: null}
			<div>
				
				{successfulRequest ? friendRequests.map((element: any) => {
					return(
						<FriendRequest key={element.request_id} data={element} acceptFunction={() => {acceptRequest(element.request_id, element.from_user, element.proposed_name, element.proposed_description, element.chatnumber)}} />
					)
				}) : null}
				<button onClick={fetchFriendRequests}>Refresh</button>
			
			</div>

		</div>
	);
};

export default FriendRequestBar;


