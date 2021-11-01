import { useState } from "react";
const basicRequestObject = require("./basicRequestObject");

interface Props {
	userNumber: number,
	chatNumber: number,
}

const MessageInput = (props: Props) => {
	const [message, getMessage] = useState("")

	function sendText() {
		if (message === "") {
			console.log("no message content")
		} else {
			const data = {
				message: message,
				userNumber: props.userNumber,
				chatNumber: props.chatNumber
			}
			const reqObject = basicRequestObject(data)
			const url = "http://localhost:5000/api/sendNewText"
			fetch(url, reqObject)
			.then(response => {
				if (response.status === 200) {
					getMessage("")
				};
			});
		};
	};

	return(
		<div className="messageInput">
			<input type="text" placeholder="message" value={message} onChange={(e: any) => getMessage(e.target.value)} />
			<button onClick={sendText} >Send</button>
		</div>
	)
}

export default MessageInput;
