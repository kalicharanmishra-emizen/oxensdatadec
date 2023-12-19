const Order = require('../models/Order/orderModel')
    
const updatePendingOrders = async (req, res) => {
    try {
        const currentDate = new Date()
        const result = await Order.aggregate([
            {
                $addFields: { 
                    "dateDiffHours":{ 
                        $dateDiff: {
                            startDate: "$createdAt",
                            endDate: currentDate,
                            unit: "hour",
                        }
                    }
                }
            },
            {
                $match:{
                    $expr:{
                        $and:[
                            {$eq: ["$paymentStatus", 0]},
                            {$lt: ["$dateDiffHours", 24]},
                        ]
                    }
                }
            },
            {
                $project:{
                    createdAt:1,
                    currentTime:currentDate,
                    dateDiff:"$dateDiffHours",
                    paymentStatus:1,
                    status:1
                }
            }
        ])

        if (result) {
            result.map(async (item) => {
                await Order.findByIdAndUpdate(
                    item._id, 
                    {
                        $set: { status: 8, paymentStatus: 2},
                    }
                )
            })
        }

    } catch (error) {
        console.log({
            title:"prduct update cron error",
            message:error,
            time:new Date()
        });
    }
}

module.exports = {updatePendingOrders}