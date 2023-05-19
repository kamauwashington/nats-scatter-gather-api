
import { ALPHA_VANTAGE_KEY, BASE_URL, ORIGIN } from './constants.ts';
import { baseSubscription } from '../common/base.subscription.ts';


baseSubscription(ORIGIN,"Time Series Daily",(symbol : string) => {

    //https://www.alphavantage.co/documentation/#dailyadj
    return `${BASE_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
});
