import { default as express, Application, Request, Response } from 'express';
import { JSONCodec, Codec, Msg, RequestStrategy, QueuedIterator } from 'nats';
import { PORT, SUBJECT } from './common/constants.ts';
import { natsConnection } from './common/connection.ts';



// create the express application (this is the server)
const app: Application = express();

// create a jsonCodec instance for decoding bytes returned from the subject into JSON
const jsonCodec : Codec<unknown> = JSONCodec();

// amount in ms available for each gather operation
const gatherTimeoutDuraation : number = 750;

// create an async get request function that takes "symbol" as a query parameter
app.get('/stock-info', async (request: Request, response: Response): Promise<void> => {
    
    // validate that a symbol is supplied prior to submitting a request to Nats
    if (request.query && request.query.symbol) {

        // array that stores the messages gathered by subject subscribers
        const msgs : any[] = [];
        
        // force "symbol" to be a string (as query parameters can be multiple types beyond string)
        const symbol : string = request.query.symbol as string;

        // THIS IS IMPORTANT, the request many function
        natsConnection.requestMany(SUBJECT,Buffer.from(symbol), {
            strategy : RequestStrategy.Timer, // need some documentation here as it wasn't available in the comments of the source
            maxWait : gatherTimeoutDuraation
        }).then(async (messages : QueuedIterator<Msg>)=>{
            for await (const message of messages) {

                // decode the message from bytes into JSON
                const messageAsJSON = jsonCodec.decode(message.data);

                // add the message to response array of the API
                msgs.push(messageAsJSON);
            }

            // send the array of messages to the client (if this is not called, the API hangs and doesn't timeout)
            response.send(msgs);
        }).catch((reason)=> {
            if (reason.code && reason.code == 503) {

                // Nats returns a 503 if a subject is unavialble or does not have any subscribers
                response.send({error:`The Nats Subject "${SUBJECT}" is unavailable or does not have any subscribers attached.`});
            } else {
                
                // send raw error if other than 503, this can be expanded to catch other codes as well
                response.send ({"error" : reason}); 
            }
        })
        
        
    } else {
        response.send({"error" : `A stock symbol must be supplied as the query parameter 'symbol'.`}) 
    }
});

app.listen(PORT, (): void => {
    console.log(`Express Server is listening on port: ${PORT}`);
});


