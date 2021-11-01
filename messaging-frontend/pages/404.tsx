import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const NotFound: React.FunctionComponent<{}> = () => {
	const router = useRouter();
	useEffect(() => {
		setTimeout(() => {
			router.push("/");
		}, 1000)
	})
	return(
		<div className="not-found">
			<h1>oh dear!</h1>
			<h2>this page does not exist</h2>
		</div>
	)
}

export default NotFound;

