import { createTransport } from 'nodemailer'

const host = process.env.EMAIL_HOST
const port = process.env.EMAIL_PORT
const user = process.env.EMAIL_AUTH_USER
const pass = process.env.EMAIL_AUTH_PASS

if (!pass) {
	console.log("NODEMAIER: you need pass to smtp email to send mail");
}

const transporter = createTransport(
	{
		host,
		port, // true for 465, false for other ports
		auth: {
			user,
			pass,
		},
	},
	{
		from: `${"Bazalt"} <${user}>`,
	}
)

class EmailService {
	static send = (email, subject, data) => {
		transporter.sendMail(
			{
				to: email,
				text: 'text',
				html: data,
				subject: subject,
			},
			(err) => console.log(err ? err.message : "NODEMAILER: email has sent")
		)
	}
}

export default EmailService
