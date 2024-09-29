const { StatusCodes }= require('http-status-codes');
const { BookingService } = require('../services/index');

const { createChannel , publishMessage  } = require('../utils/messageQueues')

const { REMINDER_BINDING_KEY } = require('../config/severconfig');

const bookingService = new BookingService();
class BookingController{
constructor (channel){
    
}
    async  sendMessageToQueue (req , res) {
        const channel = await createChannel();
        const payload = { 
          data :{
            subject : 'This is notification from queue',
            content : 'Some queue will subscribe this',
            recipientEmail: 'sharmayashswa777@gmail.com',
            notificationTime: '2024-01-25T05:30:00'
          },
          service : 'CREATE_TICKET'
         } ;
        publishMessage(channel , REMINDER_BINDING_KEY , JSON.stringify(payload));
        return res.status(200).json({
            message : 'successfully published the event '
        })
    }

    async create (req,res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message : 'Successfully completed Booking',
                success : true ,
                err     : {},
                data    : response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message : error.message,// samjh nahi aayi kanha se aaya
                success : false,
                err     : error.explanation,// samjh nahi aayi kanha se aaya kuch import to kiye nahi
                data    : {}
            })
        }
    }


}


module.exports =     BookingController  

