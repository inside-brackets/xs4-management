import mongoose from 'mongoose';

const con = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Connected : MongoDb connected with ${db.connection.host}`
    );
  } catch (error) {
    console.error(
      `ERROR : Not able to connect database due to ${error.message}`
    );
    process.exit(1);
  }
};

export default con;
