import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.connection.on('connected', ()=>{
    //   console.log('DataBase Connected')
    // })
    await mongoose.connect(`${process.env.MONGODB_URI}/QuickGPT`)
    console.log('DataBase Connected Successfully')
  } catch (error) {
    console.log(error, error.message)
  }
}

export default connectDB