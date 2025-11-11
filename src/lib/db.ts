
import { MongoClient, ServerApiVersion } from "mongodb"

const uri = process.env.MONGODB_URI;
console.log("MONGODB_URI:", uri);

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const clientPromise = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await clientPromise.connect();
    await clientPromise.db("shop").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
export default clientPromise;
