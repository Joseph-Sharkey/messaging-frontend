import doNothing from "./doNothing"
const nothing = doNothing
//this will convince typescript that this is a module

function basicRequestObject(data: any) {
	const newObject = {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"content-Type": "application/json",
			"credentials": "include"
		},
		body: JSON.stringify(data)
	}
	return newObject;
}

module.exports = basicRequestObject;