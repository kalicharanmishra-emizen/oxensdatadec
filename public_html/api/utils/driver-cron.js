const { assignOrderToDriver } = require("../controllers/driver/orderController")
const DriverJob = require("../models/Driver/jobModel")
const DriverAssign = require("../models/Order/assign/AssigingDriverModel")

const driverCron = async (req, res) => {
    try {
       const hourago = new Date(new Date().getTime() - (2000*60*60));
        const previousTime = new Date(new Date().setSeconds(new Date().getSeconds() - 35))
        const result = await DriverAssign.aggregate([
           {
                $match:{
                    // _id:{$not:{$in:}},
                    status:{ $ne: false },
                    try: { $lte: 5 },
                    createdAt: { $gt: hourago },
                    time: { $lt: previousTime }
                }
           },
        ])
        if (result.length !== 0) {
            result.map( async (assignedDriverData) => {
                let jobData = await DriverJob.findOne(
                    {$and:[
                        { driverId : { $in : assignedDriverData.driverIds } },
                        { orderId : assignedDriverData.orderId },
                        { status : { $eq: 0 } }
                    ]}
                )
                if (jobData) {
                    await DriverJob.findByIdAndDelete(jobData._id)
                    assignOrderToDriver(jobData.orderId)
                }else{
                    if(assignedDriverData.try >= 5) {
                        await DriverAssign.findByIdAndUpdate(assignedDriverData._id,{$set:{status:false}},{new:true}) 
                    }else{
                        assignOrderToDriver(assignedDriverData.orderId)
                    }
                }
            })
        }

    } catch (error) {
        console.log({
            title:"driver cron error",
            message:error,
            time:new Date()
        });
    }
}

module.exports = { driverCron }