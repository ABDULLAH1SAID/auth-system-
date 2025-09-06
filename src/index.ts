import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./dB/dBConnection";

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});


