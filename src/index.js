const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const {PORT} = require('./config/severconfig');
const apiRoutes = require('./routes/index');
const db = require('./models/index');

 const setupAndServer =  () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));// Read the request body properly

        app.use('/api',apiRoutes);
    app.listen(PORT , ()=>{
        console.log(`server started on port ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter  : true})
        }
    })


}
setupAndServer();