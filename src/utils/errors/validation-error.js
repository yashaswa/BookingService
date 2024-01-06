const {StatusCodes} = require('http-status-codes')
class ValidationError extends Error{

    constructor(){
            super();
        let explanation = [];
        error.error.forEach((err) =>{
            explanation.push(err.message)
        })
            this.name = "ValidationError";
            this.message = 'Not able to validate the data sent in the request'; 
            this.explanation= explanation;
            this.statusCode= statusCode.BAD_REQUEST;
    }
}
module.exports  = ValidationError;