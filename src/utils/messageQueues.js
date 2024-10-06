const amqplib = require('amqplib');
const {MESSAGE_BROKER_URL,EXCHANGE_NAME,} = require('../config/severconfig')

const createChannel = async ()=>{

    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);//set connection to rabbitmq
    const channel = await connection.createChannel();//create a channel
    await channel.assertExchange(EXCHANGE_NAME, 'direct' ,false);//set up distributor of msg//for creating an exchange, {exchange ka naam apan ne .env me airline_booking rakha hai yeh kuch bhi rakh sakte hai lekin dono jagah reciver as well as sender ka exchange same hona chahiya}
    return channel; // this is like broker exchange as in stocks.. // reason for assert exchange is ki kabhi koi exchange is naam ka nahi mila to wo use create kar dega is naam se of pahle se exist kar raha ho to koi problem nahi hai

    } catch (error) {// binding key = konsi queue me bhejoge msg har queue ki ek binding key hogi
        error;
    }
}
const subscribeMessage = async (channel , service ,binding_key)=>{// service is if you want to use any service from the services you are having without hitting controller you can pass it here
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');    

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
    
        channel.consume(applicationQueue.queue, msg =>{// this is consume function which will consume all msg from the queue 
            console.log('received data');
            console.log(msg.content.toString());// content function which will get the contend of the msg from the msg queue
            channel.ack(msg);
        })
    } catch (error) {
        throw error;
    }
   
}

const publishMessage = async (channel ,binding_key, message) =>{// booking service me keval publish wala kaam ho rha hai subscribe matlab recive to reminder me ho raha hai
    try {
        await channel.assertQueue('QUEUE_NAME'); // queue create kar dega agar exist nahi karti hai to 'queue_name' naam se 
        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));// exchange_name naam ke exchange par , binding key jo bheji hai, jo message bheja hai Buffer because wo rabbitmq me binaryBuffer form me data ko expect karta hai 
    } catch (error) {
        throw error;
    }
} 
module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}