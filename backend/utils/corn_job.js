const controller = require(`${config.path.controller}/controller`);
const cron = require('node-cron');

module.exports =  class CronJob extends controller {
   
    cronDeleteUser() {
        const time = new Date();
        const min = time.getMinutes();
        const hour = time.getHours();
        const date = time.getDate();
        const month = time.getMonth();
        
        cron.schedule(
            `${min} ${hour + 24} ${date} ${month + 1} *` , async () => {
                const user = await this.model.user.findOneAndRemove({ email_verified: false })
                if (user) {
                    console.log( "Removed User: ", user.email );
                    console.log(` task completed at ${hour + 24}: ${min}`)
                }
            },
            {
                scheduled: true,
                timezone: "Asia/Tehran",
            }
        ); 
    }
}
