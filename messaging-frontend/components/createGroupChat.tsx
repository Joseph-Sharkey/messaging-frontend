import {useState} from "react"
const basicRequestObject = require("./basicRequestObject");
interface Props {
	userNumber: number
}

const CreateGroupChat = (props: Props) => {
	const [showComponent, getShowComponent] = useState<boolean>(false)
	const [chatName, getChatName] = useState<any>("")
	const [chatDescription, getChatDescription] = useState<any>("")
	const [currentParticipant, getCurrentParticipant] = useState<any>("")
	const [participants, getParticipants] = useState<any>([])
	const [error, getError] = useState<boolean>(false)
	const [success, getSuccess] = useState<boolean>(false)
	function createChat() {
		if (participants.length === 1 || chatName === "" || chatDescription === "") {
			getError(true)
			setTimeout(() => {
				getError(false)
			}, 2000)
		}
		else {
			const data = {
				userNumber: props.userNumber,
				requestedNumbers: participants,
				chatName: chatName,
				chatDescription: chatName
			};
			const requestObject = basicRequestObject(data);
			const url = "http://localhost:5000/api/sendChatFriendRequests"
			fetch(url, requestObject)
			.then(response => {
				if (response.status === 200) {
					getSuccess(true)
					setTimeout(() => {
						getShowComponent(false)
					}, 1000)
				} else {
					getError(true)
				};
			});
		};
	};
	function inputParticipant(value: any) {
		let newArray = [...participants, value] 
		getParticipants(newArray)
		getCurrentParticipant("")
	};
	
	return(
		<div>
			<div>
				<button onClick={() => getShowComponent(!showComponent)}>create New Group Chat</button>
			</div>
			{showComponent ? 
				(<div>
					<div>
						<label>Chat Name</label>
						<input placeholder="Chat Name" onChange={(e: any) => {getChatName(e.target.value)}} value={chatName} ></input>
					</div>
					<div>
						<label>Description</label>
						<input placeholder="Description" onChange={(e: any) => {getChatDescription(e.target.value)}} value={chatDescription}></input>
					</div>
					<div>
						<label>Add User</label>
						<input placeholder="user number" onChange={(e: any) => {getCurrentParticipant(e.target.value)}} value={currentParticipant} ></input><br />
						<button onClick={() => inputParticipant(currentParticipant)}>Add</button>
					</div>
					<div>
						{error ? <h2>Error, please try again</h2> : null}
					</div>
					<div>
						<button onClick={createChat}>Create Chat</button>
					</div>
					<div>
						{success ? <h2>Successful Creation</h2> : null}
					</div>
				</div>): null}
		</div>
	)
}

export default CreateGroupChat;

