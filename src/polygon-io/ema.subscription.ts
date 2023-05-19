import { POLYGON_IO_KEY, BASE_URL, ORIGIN } from './constants.ts';
import { baseSubscription } from '../common/base.subscription.ts';


baseSubscription(ORIGIN,"Exponential Moving Average (EMA)",(symbol : string) => {

    //https://polygon.io/docs/stocks/get_v1_indicators_ema__stockticker
    return `${BASE_URL}/indicators/ema/${symbol}?timespan=day&adjusted=true&window=50&series_type=close&order=desc&apiKey=${POLYGON_IO_KEY}`
});