const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

const Event = require("../../models/events");
const User = require("../../models/users");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  createEvent: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);

      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User doesn't exist");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
