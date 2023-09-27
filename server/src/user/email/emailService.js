import { createTransport } from "nodemailer"

const transporter = createTransport(
	{
		host: "localhost",
		service: "gmail",
		port: 8000,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "nikitatroshin2305@gmail.com",
			pass: "atdhdfadxwarltfk",
		},
	},
	{
		from: `${"Bazalt"} <${"nikitatroshin2305@gmail.com"}>`,
	}
)

class EmailService {
	send(email, text, subject, data) {
		transporter.sendMail(
			{
				to: email,
				text: text,
				html: data,
				subject: subject,
			},
			(err) => console.log(err ? err.message : "email was sent")
		)
	}
}

export default new EmailService()
