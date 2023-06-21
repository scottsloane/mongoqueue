export class Message {
  constructor(body) {
    this.body = body;
  }

  OBJ() {
    return {
      body: this.body,
    };
  }

  JSON() {
    return JSON.stringify({
      body: this.body,
    });
  }
}

export class Publisher {
  constructor(options) {
    this.options = options;
  }

  async publish(message) {
    console.log("publish", this.options.channel, message.JSON());
    try {
      await this.options.db.collection(this.options.channel).insertOne(message.OBJ());
    } catch (err) {
      console.error(err);
      return err;
    }
    return null;
  }
}

export class Subscriber {
  constructor(options) {
    this.options = options;
  }

  async next() {
    try {
      let message =  await this.options.db.collection(this.options.channel).findOneAndDelete({});
      return message.value;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
