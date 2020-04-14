const axios = require('axios')

module.exports = {

    // Mailjet send
    sendWithMailjet: (configs, to, from, subject, cc, replyTo, html) => {

        // default payload
        let payload = {
            From: {
                Email: from.email,
                Name: from.name
            },
            ReplyTo: {
                Email: replyTo.email,
                Name: replyTo.name
            },
            Subject: subject,
            HTMLPart: html
        }

        // to
        if (to && to.length > 0) {
            let recipients = []
            to.forEach((recipient) => {
                recipients.push({
                    Email: recipient.email,
                    Name: recipient.name
                })
            })

            Object.assign(payload, { To : recipients })
        }

        // cc
        if (cc && cc.length > 0) {
            let recipients = []
            cc.forEach((recipient) => {
                recipients.push({
                    Email: recipient.email,
                    Name: recipient.name
                })
            })

            Object.assign(payload, { Cc : recipients })
        }

        const data = { Messages: [payload]}

        // make api call
        return axios.post('https://api.mailjet.com/v3.1/send', data, {
            auth: {
                username: configs.api_key,
                password: configs.api_secret
            }
        })
    }
}