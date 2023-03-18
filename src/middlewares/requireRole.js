import sendResponse from "../config/server/sendResponse.js";

function requireRole(role) {
	return function (req, res, next) {
		if (req.body.role === role) {
			next();
		} else {
			return sendResponse(res, 401, 'Você não tem permissão.')
		}
	};
}

export default requireRole