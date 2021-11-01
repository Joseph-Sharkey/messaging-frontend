interface chatProps {
	chatName: null|string,
	chatDescription: null|string,
	displayMessages: any //this will be the function activated by the button to cause the home page to display messages
}

const chatComponent = (props: chatProps) => {
	return(
		<div className="contact">
			<button className="button" onClick={props.displayMessages}>
				<h2>{props.chatName}</h2>
				<h3 className="p">{props.chatDescription}</h3>
			</button>
		</div>
	);
};
export default chatComponent;