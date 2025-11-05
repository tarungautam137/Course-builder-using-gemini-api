const express = require("express");
const app = express();
const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
const courseModel = require("./Cmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./Umodel");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const key = process.env.geminiKey;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://ai-course-builder-kf04.onrender.com",
    credentials: true,
  })
);

const middleware = async (req, res, next) => {
  try {
    const { bourbon } = req.cookies;
    if (!bourbon) {
      return res.status(401).send("Please login to access this resource");
    }

    const decoded = jwt.verify(bourbon, process.env.jwtSecret);
    const { id } = decoded;

    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(" " + err.message);
  }
};

app.post("/signup", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      userName,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = savedUser.getJWT();

    res.cookie("bourbon", token, {
      sameSite: "none",
      secure: true,
    });

    res.json({ message: "User saved successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("  " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await UserModel.findOne({ userName });
    if (!user) throw new Error("User not found");

    const isMatch = await user.verifyPassword(password);
    if (!isMatch) throw new Error("Invalid password");

    const token = user.getJWT();

    res.cookie("bourbon", token, {
      sameSite: "none",
      secure: true,
    });

    res.send("Logged in successfully");
  } catch (err) {
    res.status(400).send(" " + err.message);
  }
});

app.get("/getCourseContent", middleware, async (req, res) => {
  try {
    const { courseId } = req.query;
    const courseContent = await courseModel.findById(courseId);

    res.send(courseContent);
  } catch (err) {
    console.log("ERROR --> " + err);
  }
});

app.get("/getAllCourses", middleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const courses = await courseModel
      .find({ creatorId: userId })
      .select("courseName");

    res.send(courses);
  } catch (err) {
    console.log("ERROR --> " + err);
  }
});

app.post("/generate", middleware, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user._id;

    console.log(query);

    const ai = new GoogleGenAI({
      apiKey: key,
    });

    const model = "gemini-2.5-flash";

    let newprompt = `
      You are an AI course creator.
      Generate a structured course outline in JSON format for the given topic.
      Each course must contain:
      - A course title
      - 3 lessons, each with a title

      Output only JSON, no extra text.

      Your JSON output should look like this -- {
        course_title:"xxxxx",
        lessons:[
            {
                title:"xxxxx"
            },
            {
                title:"xxxxx"
            },
            {
                title:"xxxxx"
            }
        ] 
      }

      Topic: ${query}
    `;

    const response = await ai.models.generateContent({
      model,
      generationConfig: { response_mime_type: "application/json" },
      contents: newprompt,
    });

    const raw = response.text.trim();

    const jsontext = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const jsonres = JSON.parse(jsontext);

    console.log(jsonres);

    const fullCourse = {};
    fullCourse.courseName = jsonres.course_title;
    fullCourse.creatorId = userId;
    fullCourse.lessons = [];

    let index = 0;
    const lessons = jsonres.lessons;

    for (const lesson of lessons) {
      newprompt = `
    You are an AI instructor.
    Generate detailed learning content for a lesson in a course.

    Course Title: ${jsonres.course_title}
    Lesson Title: ${lesson.title}

    Do not give json, just give content for that lesson.

    Your lesson content should not contain characters which make it difficult to parse it into json. 

    Do not give greetings or welcome messages just go straight to the content.
  `;

      const lessonContent = await ai.models.generateContent({
        model,
        config: {
          maxOutputTokens: 65536,
        },
        contents: newprompt,
      });

      const query2 = encodeURIComponent(
        `${jsonres.course_title} ${lesson.title} course`
      );

      const result = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${query2}&type=video&key=${process.env.youtubeApiKey}`
      );

      const data = await result.json();

      fullCourse.lessons[index] = {
        title: lesson.title,
        content: lessonContent.text,
        videoIds: [
          data.items[0].id.videoId,
          data.items[1].id.videoId,
          data.items[2].id.videoId,
        ],
      };
      index++;
    }

    const newCourse = new courseModel(fullCourse);

    await newCourse.save();

    res.send("course created successfully");
    console.log("course created successfully");
  } catch (err) {
    console.error("ERROR --> " + err);
  }
});

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://tarungautam137:${process.env.dbPassword}@coursebuilder.gegmrco.mongodb.net/`
  );
};

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(process.env.port, () => {
      console.log("server is listening at port " + process.env.port);
    });
  })
  .catch((err) => {
    console.error("not connected");
  });
