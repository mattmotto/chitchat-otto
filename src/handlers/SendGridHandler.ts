import {Users} from '../models/users';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class Email{
	async welcomeEmail(email){ 
        let data = await new Users().getUserByEmail(email);
        let msg = {
          to: data['email'],
          from: 'chitchat@chitchat.buzz',
          subject: 'Welcome to Chitchat!',
          text: 'Hi ' + data['name'] + ' and welcome to Chitchat!\n\nWe are very excited to have you as a new member! Chitchat is designed by college students, for college students\
 to give people a way to make new friends around the country.\n\nWe can\'t wait to see you out there! Go over to chitchat.buzz to get chatting.\n\n\
The Chitchat Team'
        };

        sgMail.send(msg);
	}

	async resetLostPasswordEmail(user, password){
		let data = await new Users().getUser(user);
		let msg = {
          to: data['email'],
          from: 'chitchat@chitchat.buzz',
          subject: 'Chitchat Password Reset',
          text: 'Hi ' + data['name'] + ',\n\nYour password has been reset. Your new password is\n\n\
' + password + '\n\nPlease log into your Chitchat account using this temporary password and use it in the "change password" section of settings to change your password.\
\n\nThe Chitchat Team'
        };

        sgMail.send(msg);
	}
}