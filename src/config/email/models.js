import dotenv from 'dotenv'
dotenv.config()

const models = {
	verificationEmail: ({ user, token }) => {
		const html = `<!DOCTYPE html>
										<html>
											<head>
												<title>Verificação de E-mail</title>
											</head>
											<body style="font-family: Arial, Helvetica, sans-serif;">
												<table style="margin: 0 auto; text-align: center;">
													<tr>
														<td>
															<h1>Verificação de E-mail</h1>
															<h3>Olá ${user}</h3>
															<p>Para verificar o seu e-mail, clique no botão abaixo:</p>
															<a href="${process.env.CYCLIC_URL}/user/verifyemail/${token}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar E-mail</a>
															<p>Se você não solicitou esta verificação, por favor, ignore este e-mail.</p>
														</td>
													</tr>
												</table>
											</body>
										</html>
										`;
		const subject = 'Verificação de Email';
		return { html, subject };
	}
};

export default models;
