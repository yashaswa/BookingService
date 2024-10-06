const { StatusCodes }= require('http-status-codes');
const { BookingService } = require('../services/index');

const { createChannel , publishMessage  } = require('../utils/messageQueues')

const { REMINDER_BINDING_KEY } = require('../config/severconfig');

const bookingService = new BookingService();
class BookingController{
constructor (channel){
    
}
    async  sendMessageToQueue (req , res) {
        console.log("yashaswa");
        const {arrivalTime} =  req.body;
        const {departureTime} = req.body;
        console.log(req.body);
        
        const ArrivalTime = new Date(arrivalTime);
        
        const NotificationTime = new Date(ArrivalTime.getTime() - 24 * 60 * 60 * 1000);
        const notificationTime = NotificationTime.toISOString();
        const channel = await createChannel();
        const payload = { 
          data :{
            subject : 'regarding scheduled arrival and departure of you flight',
            content : `Hello sir you are having a flight at ${arrivalTime} and departure time is ${departureTime} you should come 2 hour prior to arrival time`,
            recipientEmail: 'sharmayashswa777@gmail.com',
            notificationTime: notificationTime
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
                message : error.message,// jo bhi error aayega uska message 
                err     : error.explanation,// error ke data ka explaination wala part
                data    : {}
            })
        }
    }


}


module.exports =     BookingController  

