const {StatusCodes} = require('http-status-codes');

class ServiceError extends Error{
    constructor(message =" Something went wrong " ,
               expanation = " Service Layer Error",
               statusCode = StatusCodes.INTERNAL_SERVER_ERROR 
               ){   super();
                    this.name = "ServiceError"
                    this.message= message;
                    this.expanation= expanation;
                    this.statusCode = statusCode;
                 }
}
module.exports= ServiceError;