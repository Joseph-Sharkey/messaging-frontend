import {useState, useEffect} from "react";
const basicRequestObject = require("./basicRequestObject");

interface Props {
	chatNumber: number,
	userNumber: number,
	chatName: string,
	chatDescription: string
}


const AddChatMember = (props: Props) => {
	const [showForm, getShowForm] = useState<boolean>(false)
	const [requestedNumber, getRequestedNumber] = useState<any>("")
	const [error, getError] = useState<boolean>(false)
	const [success, getSuccess] = useState<boolean>(false)
	
	function addNewChatMember() {
		if (requestedNumber === "") {
			getError(true)
			setTimeout(() => {
				getError(false)
			})
		}
		else {
			const data = {
				chatNumber: props.userNumber,
				requestedNumber: requestedNumber,
				proposedChatName: props.chatName,
				proposedChatDescription: props.chatDescription 
			}
			const reqObject = basicRequestObject(data)
			const url = "http://localhost:5000/api/createAnotherFriendRequest"
			fetch(url, reqObject)
			.then(response => {
				if(response.status === 200) {
					getSuccess(true)
					setTimeout(() => {
						getSuccess(false)
					}, 1000)
					getShowForm(false)
				} else {
					getError(true)
					setTimeout(() => {
						getError(false)
					})
				}
			})
		}
	}
	return(
		<div>
			<button onClick={() => getShowForm(true)}>Add new chat member</button>
			<div>
				{showForm ? 
					<div>
						<div>
							<label>User Number</label><br />
							<input value={requestedNumber} onChange={(e: any) => {getRequestedNumber(e.target.value)}} placeholder="User Number"></input><br />
							<button onClick={() => addNewChatMember()}>Add Participant</button>
						</div>
					</div>	
				: null}
			</div>
			{success ? <h2>request sent</h2> : null}
			{error ? <h2>couldn't fetch data</h2> : null}
		</div>
	)
}

export default AddChatMember;