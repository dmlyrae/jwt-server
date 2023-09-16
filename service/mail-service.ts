import { AppDataSource } from "../connect/connect";
import { TransportOptions, Transporter, createTransport } from "nodemailer"

class MailService {
	private transporter:Transporter;

	constructor () {
		const transportOptions = {
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		} as TransportOptions;
		this.transporter = createTransport<TransportOptions>(transportOptions)
	}

	async sendActivationMail(to: string, link: string) {
		try {
			const result = await this.transporter.sendMail({
				from: process.env.SPMT_USER,
				to,
				subject: `Please verify your email address on ${process.env.SITE_NAME}.`,
				text: ``,
				html: /*html*/`
					<div>
						<h1>Hi Dear User</h1>
						<h3>Please verify your email address so we know that it's really you!</h3>
						<a
							href="${link}"
						>
							Click here.
						</a>
					</div>
				`,
			})
			console.log('send email ', result)
		} catch (e) {
			console.warn("Error in sendActivationMail.", e.message)
		}
	}
}

export const mailService = new MailService();