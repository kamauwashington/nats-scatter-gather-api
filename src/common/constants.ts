export const SUBJECT : string = process.env.SUBJECT || "stock.request";
export const NATS_SERVER : string = process.env.NATS_SERVER || "localhost";
export const PORT : number = parseInt(process.env.PORT || "3000");
export const POLYGON_IO_KEY : string = process.env.POLYGON_IO_KEY || "no-key";