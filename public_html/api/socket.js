const User = require('./models/usersModel');
const Order = require('./models/Order/orderModel');
// all user socket Connection
let userSocket = {};
/* socket function start */
/* base function start */
    const sendSocketToUser = (userId,method,data)=>{
        try {
            console.log('userId',userId);
            console.log('method',method);
            // console.log('data',data);
            userSocket[userId].forEach(connection => {
                connection.emit(method,data)
            });    
        } catch (error) {
            console.error({
                title:'error',
                error:error,
                timestamp:new Date()
            });
        }
        
    }
    const isFine = (data) =>{
        if (data!==null && data !== undefined && data !=='') 
            return true

        return false
    }
    // const sendSocketToAll = (userId,method,data)=>{
    //     userSocket[userId].forEach(connection => {
    //         connection.emit(method,data)
    //     });
    // }
/* base function end */
// accpet all socket request
const accpetReq = async (socket)=>{
    /* user connect and disconnect start */
        socket.on('connectUser',(data)=>{
            socket.userId = data.userId
            if (userSocket.hasOwnProperty(data.userId)) {
                let tempdata=userSocket[data.userId].find(list=>list.id==socket.id)
                if (!tempdata) {
                    userSocket[data.userId].push(socket)
                }
            } else {
                userSocket[data.userId]=[socket]
            }
            // send success reponse
            socket.emit('connectUser',data)
            console.log({
                title:'userConnect',
                userId:data.userId,
                socketId:socket.id,
                timestamp:new Date()
            });
        })
        socket.on('disconnect', () => {
            if (userSocket[socket.userId]) {
                let tempKey = userSocket[socket.userId].indexOf(item=>item.id==socket.id)
                userSocket[socket.userId].splice(tempKey, 1);
            }else{
                console.log('user not found');
            }
            console.log('user disconnected')
        })
    /* user connect and disconnect end */
    /* driver socket event start */
        socket.on('updateLocation',async (data)=>{
            // console.log("updateLocation ---------", data);
            try {
                if (!isFine(data.orderId) || !isFine(data.lng) || !isFine(data.lat)) {
                    socket.emit('updateLocation',{
                        type:"error",
                        message:"Not a valid data"
                    })
                }else{
                    await User.findByIdAndUpdate(socket.userId,{$set:{
                        "driver_profile.currentLocation.coordinates":[data.lng,data.lat]
                    }})
                    let order = await Order.findById(data.orderId,{
                        _id:0,
                        userId:1
                    });
                    let sendData = {
                        lng:data.lng,
                        lat:data.lat,
                        orderId:data.orderId,
                        driverId:socket.userId
                    }
                    sendSocketToUser(order.userId,'updateLocation',sendData)
                }
                
            } catch (error) {
                socket.emit('updateLocation',{
                    type:"error",
                    message:"Somthing went wrong"
                })
            }
            
        })
    /* driver socket event end */
}
const orderHandler = async (data) =>{
    switch (data.type) {
        case 'placeOrder':
            // send notification to vendor for new order
            sendSocketToUser(data.storeId,'placeOrder',data)
            break;
        case 'orderStatus':
            // send notification to user for order Status
            sendSocketToUser(data.orderData.userId,'orderStatus',data)
            break;
        default:
            break;
    }
}
const driverJobHandler = async (data)=>{
    switch (data.type) {
        case 'getJob':
            // send notification to driver for new order
            sendSocketToUser(data.driverId,'getJob',data)
            break;
        default:
            break;
    }
}
const otherEventHandler = async (data)=> {
    switch (data.type) {
        case 'emailVerified':
            sendSocketToUser(data.driverId,'emailVerified',data)
            break;
        default:
            break;
    }
}

module.exports = {accpetReq, orderHandler, driverJobHandler, otherEventHandler}