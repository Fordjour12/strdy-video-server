import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

import ffmpeg from "fluent-ffmpeg";

const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const port = Number(process.env.PORT);

app.get("/", (request, response) => {
  response.send(`
  <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
      "
    >
      <h1 style="font-size:40px;text-transform:uppercase;">Hello World from stryd video server</h1>
      <p>Processing fitness video one frame a time...</p>
      <a
        href="/static"
        style="
          display: inline-block;
          padding: 10px 20px;
          color: #fff;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
          text-align: center;
          transition: background-color 0.3s ease;
          :hover {
            background-color: #0056b3;
          }
        "
      >
        Visit Upload
      </a>
    </div>
  `);
});

app.use("/static", express.static("static"));

const ingress = path.join(__dirname, "uploads/ingress/");
const egress = path.join(__dirname, "uploads/egress/");
if (!fs.existsSync(ingress) || !fs.existsSync(egress)) {
  console.error("Error: File path not found");
  fs.mkdirSync(ingress, { recursive: true });
  fs.mkdirSync(egress, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, ingress);
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: multerStorage,
});

app.post("/upload", upload.single("file"), (request, response) => {
  // request.file deprecated
  const file = request.file;

  console.log({ "rqfile >>": request.file, "requestBody >>": request.body });

  if (!file) {
    response.status(400).json({ message: "No file uploaded" });
  }

  // TODO: split the extension
  const fileName = file?.originalname.split(".")[1];

  try {
    const outputDirectory = "./uploads/egress/";
    const newDir = path.join(outputDirectory, String(fileName));
    if (!fs.existsSync(String(fileName))) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    const outputFileName = `${fileName}output.m3u8`; // HLS playlist file

    const command = ffmpeg(file?.path)
      .outputOptions("-hls_time", "9") // Set the segment duration to 9 seconds
      .outputOption("-hls_playlist_type", "vod") // Create a VOD (Video On Demand) playlist
      .outputOptions(
        "-hls_segment_filename",
        path.join(newDir, "segment%03d.ts")
      ) // Set the segment file names
      .output(path.join(newDir, outputFileName)) // Output to output.m3u8
      .on("end", () => {
        console.log("File has been converted successfully");
      })
      .on("error", (err) => {
        console.log("An error occurred: " + err.message);
      })
      .run();
    response.send(`<h2>File has been upload Successfully</h2>`);
  } catch (error) {
    console.error(error);
  }
});

const callback = () => console.log(`Listening on port ${port}`);
app.listen(port, callback);
