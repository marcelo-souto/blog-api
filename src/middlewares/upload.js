import multer from 'multer';
import sendResponse from '../config/server/sendResponse.js';

const config = {
	dest: '/tmp',
	fileFilter: (req, file, callback) => {
		const allowedFiles = ['image/jpg', 'image/jpeg', 'image/png'];

		if (allowedFiles.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(Error('Extensão de arquivo não aceito'), false);
		}
	},
	limits: { fieldSize: 2000000 }
};


const upload = (req, res, next) => {
	const multerUpload = multer(config).single('upload');
	const userId = req.body.userId

	multerUpload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return sendResponse(res, 400, err.message)
		} else if (err) {
			return sendResponse(res, 400, err.message)
		}
		req.body.userId = userId
		next();
	});
}

export default upload
