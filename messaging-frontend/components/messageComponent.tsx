import { useEffect, useState } from "react";
import MessageInput from "./messageInput";
import AddChatMember from "./addChatMember";
interface messageProps {
	chatName: string,
	chatDescription: any,
	chatNumber: number,
	userNumber: number
}

interface message {
	message_key: number,
	sent_by: string,
	sent_to: string,
	content: string,
	time_sent: any
}

interface participant {
	userNumber: number,
	name: string,
	description: string
}

const MessageComponent = (props: message) => {
	return(
		<div className="contact">
			<div className="message">
			<p>sent by user {props.sent_by}</p>
			<h3>{props.content}</h3>
			</div>
		</div>
	);
};


const ChatParticipantComponent = (props: participant) => {
	function requestFriend(userNumber: number) {
		const requestObject = {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"content-Type": "application/json",
				"credentials": "include"
			},
			body: JSON.stringify(userNumber)
		}
		const url = "http://localhost:5000/api/findNewUser"
		//this fetch request requires a description input and other input that would require more code so for the time being i won't be making it 
	}

	return(
		<div>
			<h2>{props.name}</h2>
			<p>{props.description}</p>
		</div>
	);
};


const MessageBoard = (props: messageProps) => {
	const [displayDescription, getDisplayDescription] = useState(false);
	const [messages, getMessages] = useState<any>([])
	const [chatParticipants, getChatParticipants] = useState<any>([])
	const [dataInfo, getDataInfo] = useState({
		chatParticipantData: false,
		chatParticipantError: false,
		displayChatParticipantData: false
	});
	const [displayChatParticipants, getDisplayChatParticipants] = useState<boolean>(false)
	const [error, getError] = useState<boolean>(false);
	useEffect(() => {
		let url = `http://localhost:5000/api/findUserChatData?chatNumber=${props.chatNumber}`
		fetch(url)
		.then(response => {
			return response.json()
		})
		.then(dataObject => {
			console.log("user")
			if (dataObject.data) {
				getMessages(dataObject.data)
			} else {
				console.log("no messages were recieved")
			}
		})
		.then(() => {
			pageRefresh()
		})
		.catch(err => {
			console.log(err)
		})
	}, [])
	
	function pageRefresh() {
		//checks for new messages every 3 seconds
		//we will make it more efficient by fetching only messages with a larger primary key than the last message in the arr
		setInterval(() => {
			let highestId = 0
			let url = `http://localhost:5000/api/getNewMessages?chatNumber=${props.chatNumber}&highestId=${highestId}`
			fetch(url)
			.then(response => {
				return response.json()
			})
			.then((dataObject2: any) => {
				if (dataObject2.data) {
					getMessages(dataObject2.data)
				} else {
				}
			})
		}, 2000)
		
	}

	function fetchChatParticipants(chatNumber: number) {
		console.log("fetching chat participants")
		const url = `http://localhost:5000/api/findChatMembers?chatNumber=${chatNumber}`
		fetch(url)
		.then(response => {
			return response.json()
		})
		.then(dataObject => {
			if (dataObject) {
				getChatParticipants(dataObject.data)  	
			} else {
				getError(true)
				getDataInfo({
					chatParticipantData: false,
					chatParticipantError: true,
					displayChatParticipantData: dataInfo.displayChatParticipantData
				});	
			}
		})
	}
		return (
		<div>
			<div>
				<h1>{props.chatName}</h1>
				<button onClick={() => {getDisplayDescription(!displayDescription)}} >Show Description</button>
				<button onClick={() => {
					if (chatParticipants.length === 0){
						console.log("executing button click")
						getDisplayChatParticipants(true)
						fetchChatParticipants(props.chatNumber)
					} else {
						console.log(chatParticipants)
						getDisplayChatParticipants(!displayChatParticipants)
					}
				}}>Show Participants</button>
				{displayDescription ? <p>{props.chatDescription}</p> : null}

				{displayChatParticipants ? chatParticipants.map((participant: any) => {
					return(
						<ChatParticipantComponent key={participant.user_id} name={participant.username} userNumber={participant.user_id} description={participant.description }/>
					)
				}): null}

			</div>
			<div className="div">
				{messages.map((text: any) => {
					return(
						<MessageComponent message_key={text.message_key} sent_by={text.sent_by} sent_to={text.sent_to} content={text.content} time_sent={text.time_sent} key={text.message_key} />
					)
				})}
			</div>
			<div>
				<MessageInput userNumber={props.userNumber} chatNumber={props.chatNumber}/>
			</div>
			<div>
				{error ? <h2>there was an error during a request</h2> : null}
			</div>
		</div>
	);
}



export default MessageBoard;
