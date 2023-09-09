import  express  from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {Register} from './controllers/auth.js'
import {CreatePost} from './controllers/post.js'
import authRouter from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/user.js";
import Post from "./models/post.js";
import {users,posts} from "./data/index.js"

const __fileName = fileURLToPath(import.meta.url);
const __dirName=path.dirname(__fileName)
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors());
app.use("/assets", express.static(path.join(__dirName, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


app.post("/auth/register",upload.single("picture"),Register)
app.post("/posts",verifyToken,upload.single("picture"),CreatePost)

app.use("/auth",authRouter)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port: ${PORT}`))
    // User.insertMany(users);
    // Post.insertMany(posts)
}).catch((error)=>{
    console.log(`${error} did not connect`) 
})