import defaultStatusCodeResponses from './defaultStatusCodeResponse.js';

const sendResponse = (res, status, message, data) => {

	const codeResponse = defaultStatusCodeResponses[status];
	const success = codeResponse.success;
	message = message ? message : codeResponse.message;
	const response = data
		? { success, status, message, data }
		: { success, status, message };

	return res.status(status).json(response);
};

export default sendResponse;