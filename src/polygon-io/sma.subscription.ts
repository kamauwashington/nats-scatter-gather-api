import { POLYGON_IO_KEY, BASE_URL, ORIGIN } from './constants.ts';
import { baseSubscription } from '../common/base.subscription.ts';


baseSubscription(ORIGIN,"Simple Moving Average (SMA)",(symbol : string) => {

    //https://polygon.io/docs/stocks/get_v1_indicators_sma__stockticker
    return `${BASE_URL}/indicators/sma/${symbol}?timespan=day&adjusted=true&window=50&series_type=close&order=desc&apiKey=${POLYGON_IO_KEY}`
});