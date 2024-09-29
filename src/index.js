const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const {PORT} = require('./config/severconfig');
const apiRoutes = require('./routes/index');
const db = require('./models/index');

 const setupAndServer =  () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));// Read the request body properly
    // app.get('/bookingservice/api/v1/home',(req,res) =>{
    //     return res.json({message : 'hitting the booking services'});
    // })
        app.use('/bookingservice/api',apiRoutes);
    app.listen(PORT , ()=>{
        console.log(`server started on port ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter  : true})
        }
       
    });


}
setupAndServer();