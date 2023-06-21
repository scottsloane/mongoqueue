import { MongoClient } from "mongodb";
import { Publisher, Subscriber, Message } from "./index.js";

const client = new MongoClient("mongodb://192.168.1.134:27017");

(async () => {
  try {
    await client.connect();
    const db = client.db("mongoqueue");

    const publisher = new Publisher({
      db,
      channel: "test",
    });

    const subscriber = new Subscriber({
      db,
      channel: "test",
    });

    setInterval(async () => {
      const message = await subscriber.next();
      if(message)
        console.log("Sub Next: ",message);
    }, 500);

    let i = 0;
    setInterval(async () => {
      i += 1;
      let err = await publisher.publish(new Message(i));
      if(err) {
        console.error(err);
        return;
      }
    }, 1000);
  } catch (err) {
    console.error(err);
    return;
  }
})();
