const { updatePendingOrders } = require("../utils/product-cron");
const { driverCron } = require("../utils/driver-cron");
var cron = require('node-cron');

const updateOrders = () => {
    const updateOdrerStatus = cron.schedule('0 0 0 * * *', () => { 
        console.log("cron run every 12:00 Am");
        updatePendingOrders() 
    }); // run every 12:00 Am
    updateOdrerStatus.start()
}

const assignDriver = () => {
    const assignOrderToDriver = cron.schedule("*/20 * * * * *", () => { 
        // console.log("running a task every 20 second");
        driverCron() 
    }); // run every 12:00 Am
    assignOrderToDriver.start()
}

module.exports = {updateOrders, assignDriver}