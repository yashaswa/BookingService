const  axios = require('axios');
const {BookingRepository} = require('../repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/severconfig');
const { ServiceError } = require('../utils/errors');
const booking = require('../models/booking');


class BookingService{
    constructor(){
        this.bookingRepository= new BookingRepository();
    }
    async createBooking(data){
        try {
            const flightId= data.flightId;
            const getFLightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response = await axios.get(getFLightRequestURL);
            const flightdata=  response.data.data;
            let priceOfFlight = flightdata.price;
            if(data.noOfSeats > flightdata.totalSeats){
                throw new ServiceError('something went wrong in booking process','Insufficient seats')
            }
            const totalCost = priceOfFlight * data.noOfSeats;
            const bookingPayload = {...data ,totalCost}

            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequesURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;

            await axios.patch(updateFlightRequesURL,{totalSeats : flightdata.totalSeats - booking.noOfSeats});
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