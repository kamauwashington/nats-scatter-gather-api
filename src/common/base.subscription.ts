import { JSONCodec, Codec, NatsError, Msg } from 'nats';
import { SUBJECT } from '../common/constants.ts'
import axios from 'axios';
import { TextDecoder } from 'util';
import { natsConnection } from '../common/connection.ts';
import { IVendorResponse } from '../common/vendor-response.interface.ts';

// create a jsonCodec instance for decoding bytes returned from the subject into JSON
const jsonCodec : Codec<unknown> = JSONCodec();

// create a TextDecoder to read byte data returned from the published data
const textDecoder : TextDecoder = new TextDecoder();

/**
 *  This function encapsulates the functionality for a HTTP request with results replying to a Nats Msg Token. The urlFunction
 *  allows for the URL to be constructed at runtime as it is using template literals.   
 */ 
export function baseSubscription(origin : string, method : string, urlFunction : (symbol : string) => string) : void {
    natsConnection.subscribe(SUBJECT,{
    
        // NOT TRAPPING ERRORS FOR BREVITY (this should be simple enough to implement from this starting point)
        callback : async (err : NatsError | null, msg : Msg) => {
    
            // decode the symbol for use in the following query
            const symbol : string = textDecoder.decode(msg.data);
    
            // call vendor Rest APIs
            const response = await axios.get(urlFunction(symbol));
            
            // create a vendor response so that the publisher has information as to the origin and method used to obtain a result
            const vendorResponse : IVendorResponse = {
                origin : origin,
                method : method,
                response : response.data
            }
            msg.respond(jsonCodec.encode(vendorResponse));
        }
    })
}




