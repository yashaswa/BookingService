const  axios = require('axios');
const {BookingRepository} = require('../repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/severconfig');
const { ServiceError } = require('../utils/errors');
const booking = require('../models/booking');
const {PORT} =  require('../config/severconfig');


class BookingService{
    constructor(){
        this.bookingRepository= new BookingRepository();
    }
    async createBooking(data){
        try {
            const flightId= data.flightId;
            const getFLightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response = await axios.get(getFLightRequestURL);// flight ki sari details get kari hai
            const flightdata=  response.data.data;
            let priceOfFlight = flightdata.price;
            if(data.noOfSeats > flightdata.totalSeats){
                throw new ServiceError('something went wrong in booking process','Insufficient seats')
            }
            const totalCost = priceOfFlight * data.noOfSeats;
            const bookingPayload = {...data ,totalCost}// naya payload banaaya hai janha par purane data ke sath ab total cost bhi add kar diya hai...data purana data jo tune liya tha flightl data se
            
           
            await axios.post(`http://localhost:${PORT}/bookingservice/api/v1/publish`,{
                arrivalTime : flightdata.arrivalTime,
                departureTime : flightdata.departureTime          
            });
            

            const booking = await this.bookingRepository.create(bookingPayload);// booking pay load ki help  se booking create kar rahe hai
            const updateFlightRequesURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
           
            await axios.patch(updateFlightRequesURL,{totalSeats : flightdata.totalSeats - booking.noOfSeats});// total seats ko flight me update kar rahe hai
            const finalBooking =  await this.bookingRepository.update(booking.id,{status : 'Booked'})
            
            return finalBooking;

            
            
        } catch (error) { if(error.name =='RepositoryError'|| error.name == 'ValidationError'){
            throw error;
        }
            throw new ServiceError();
        }
        
    }
}
module.exports= BookingService;
 // Convert string to Date object

