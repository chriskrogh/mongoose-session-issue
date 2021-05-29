import "dotenv/config";

import mongoose from "mongoose";

(async () => {
  await mongoose.connect(
    // connection needs to support retry writes for transactions
    // I used an atlas cluster, but similar behavior can be achieved locally with
    // https://www.npmjs.com/package/run-rs
    process.env.MONGO_URL ?? "mongodb://localhost:27017?retryWrites=false",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const authorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
  });

  const Author = mongoose.model("Author", authorSchema);

  const blogSchema = new mongoose.Schema({
    title: String,
    author: { type: mongoose.Types.ObjectId, ref: "Author" },
    date: { type: Date, default: Date.now },
  });

  const Blog = mongoose.model("Blog", blogSchema);

  const session = await mongoose.startSession();
  session.startTransaction();

  const authors = await Author.create(
    [{ firstName: "fname", lastName: "lname" }],
    { session }
  );

  const blogs = await Blog.create(
    [{ title: "test", author: authors[0]._id, date: new Date() }],
    { session }
  );

  await session.commitTransaction();
  await session.endSession({});

  // throws
  await blogs[0].populate("author").execPopulate();
})();
