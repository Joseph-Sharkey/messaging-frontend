/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import store from "../redux/store";
import { useSelector, useDispatch, Provider } from "react-redux";
import { useRouter } from "next/router";
import {changeUsername, changeDescription} from "../redux/userSlice";
import Link from "next/link";

import ChatComponent from "../components/chatComponent";
import MessageBoard from "../components/messageComponent";
import SearchBar from "../components/searchBar";
import FriendRequestBar from "../components/friendRequestBar";
import CreateGroupChat from "../components/createGroupChat";
interface dataInfo {
	personalData: boolean,
	chatData: boolean,
	messageData: boolean,
	chatParticipantData: boolean,
	friendRequestData: boolean
}

interface personalData {
	username : null|string,
	email: null|string,
	description: null|string,
	userNumber: null|number
};

interface chat {
	chat_key: number,
	chat_name: string,
	chat_description: string
	created_on: any
};

interface message {
	sentBy: string,
	message: string,
	timeSent: any	
};

interface chatParticipant {

}
interface friendRequest {

}

const HomeComponent = () => {

	const userDetails = useSelector((state: any) => state.user);

	const [dataInfo, getDataInfo] = useState<dataInfo>({
		personalData: false,
		chatData: false,
		messageData: false,
		chatParticipantData: false,
		friendRequestData: false
	})

	const [personalData, getPersonalData] = useState<any>({
		username: userDetails.username,
		description: userDetails.description,
		userNumber: userDetails.userNumber 
	});

	const [chats, getChats] = useState<any>([]);

	const [selectedChat, getSelectedChat] = useState<any>({
		chat_key: null,
		chat_name: null,
		chat_description: null,
		created_on: null
	});

	const [messages, getMessages] = useState<any>([]);
	const [chatParticipants, getChatParticipants] = useState<null|object>(null);
	const [friendRequests, getFriendRequests] = useState<null|object>(null);

	const [error, getError] = useState<boolean>(false);

	const router = useRouter();
	const dispatch = useDispatch();

	let [chatFetchingError, getChatFetchingError] = useState(false);
	const fetchUserData = () => {
		const number = userDetails.userNumber;
		const url = `http://localhost:5000/api/findUserChats?userNumber=${number}`
		console.log("fetching user chat data")
		fetch(url)
		.then((response: any)=> {
			if (response.status === 500) {
				console.log("there was an error during the request")
				getChatFetchingError(true)	
				return false
			} else {
				return response.json()
			}
		})
		.then((dataObject:any) => {
			console.log(dataObject)
			if (dataObject) {
			getDataInfo({
				personalData: dataInfo.personalData,
				chatData: true,
				messageData: dataInfo.messageData,
				chatParticipantData: dataInfo.chatParticipantData,
				friendRequestData: dataInfo.friendRequestData
			});
			getChats(dataObject)

			} else {
				getChatFetchingError(true)
			}
		})
		.catch(err => {
			getChatFetchingError(true)
		})
	}

	useEffect(() => {
		/*
		1. get userNumber from redux after auth
		2. check if user exitsts
		3. if exists get personal, chat and friend request data
		3. if not exists get username and description and create account then return data 
		*/
		console.log(userDetails)
		const number = userDetails.userNumber
		if (!number) {
			router.push("/login")
		}
		const userDataUrl = `http://localhost:5000/api/findUser?userNumber=${number}`
		fetch(userDataUrl)
		.then(res => {
			return res.json()
		})
		.then(dataObject => {
			console.log("data has been fetched")
			if (dataObject) {
				console.log(dataObject)
				fetchUserData()
			} else {
				console.log("user number not found")
				router.push("/createNewAccount");
				//after this the user will be redirected and the same function flow will begin, and their data will be present
			}
		})
		.catch(err => {
			console.log(err)
		})
	}, []);


	function displayMessages(chatNumber: number|null) {
		//gets data from requested chat
		getDataInfo({
			personalData: dataInfo.personalData,
			chatData: dataInfo.chatData,
			messageData: true,
			chatParticipantData: dataInfo.chatParticipantData,
			friendRequestData: dataInfo.friendRequestData
		});
		for (let i = 0; i < chats.length; i++) {
			if (chats[i].chat_key === chatNumber) {
				getSelectedChat(chats[i])
			}
		}
	}
	//<===== RETURN NEEDS TO BE CONDITIONAL SO WHEN CHAT COMPONENT IS CLICKED ON, THE CHATS DISAPPEAR AND THE MESSAGE COMPONENT IS RENDERED
	//do that then write the bit in the chat component for viewing participants
	//we also need the search bar for finding other users 
	// we also need the tab for friend requests so that also needs to be made
	if (dataInfo.messageData) {
		return(
			<MessageBoard chatName={selectedChat.chat_name} chatDescription={selectedChat.chat_description} chatNumber={selectedChat.chat_key} userNumber={userDetails.userNumber}/>
		);
	} else {
		return(
			<div>
				<div>
					<h1 className="medium">Messaging</h1>
					<h2>Your Number: {personalData.userNumber}</h2>
				</div>
				<div>
					<SearchBar userNumber={personalData.userNumber}/><br />
					<CreateGroupChat userNumber={personalData.userNumber} /><br />
					<FriendRequestBar userNumber={userDetails.userNumber} />
				</div>

				<div>
					<button onClick={fetchUserData}>Refresh group chats</button>
					<div>
						{dataInfo.chatData ? chats.map((element: chat) => {
							return(
								<ChatComponent key={element.chat_key} chatName={element.chat_name} chatDescription={element.chat_description} displayMessages={() => displayMessages(element.chat_key)}/>
							)
						}) : null}
					</div>
				</div>
				<div>
					{error ? <h2>there was an error whilst fetching data</h2> : null}
					{chatFetchingError ? <div><h2>you aren't currently a member of any chats</h2><h3>try making a friend request</h3></div> : null}
				</div>
			</div>
		);
	}
};

const Home = () => {
	return(
		<Provider store={store}>
			<HomeComponent />
		</Provider>
	);
};

export default Home; 
