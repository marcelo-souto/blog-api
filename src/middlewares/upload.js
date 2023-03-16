import multer from 'multer';

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

function uploadFile(req, res, next) {
	const upload = multer(config).single('upload');

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({ erro: err.message });
		} else if (err) {
			return res.status(400).json({ erro: err.message });
		}

		next();
	});
}

export default uploadFile
