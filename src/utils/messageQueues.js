const amqplib = require('amqplib');
const {MESSAGE_BROKER_URL,EXCHANGE_NAME,} = require('../config/severconfig')

const createChannel = async ()=>{

    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);//set connection to rabbitmq
    const channel = await connection.createChannel();//create a channel
    await channel.assertExchange(EXCHANGE_NAME, 'direct' ,false);//set up distributor of msg//for creating an exchange
    return channel; // this is like broker exchange as in stocks.. 

    } catch (error) {// binding key = konsi queue me bhejoge msg har queue ki ek binding key hogi
        error;
    }
}
const subscribeMessage = async (channel , service ,binding_key)=>{
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');    

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
    
        channel.consume(applicationQueue.queue, msg =>{
            console.log('received data');
            console.log(msg.content.toString());
            channel.ack(msg);
        })
    } catch (error) {
        throw error;
    }
   
}

const publishMessage = async (channel ,binding_key, message) =>{
    try {
        await channel.assertQueue('QUEUE_NAME'); 
        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
    } catch (error) {
        throw error;
    }
} 
module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}