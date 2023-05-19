
import { ALPHA_VANTAGE_KEY, BASE_URL, ORIGIN } from './constants.ts';
import { baseSubscription } from '../common/base.subscription.ts';


baseSubscription(ORIGIN,"Company Overview",(symbol : string) => {

    https://www.alphavantage.co/documentation/#company-overview
    return `${BASE_URL}/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
});
