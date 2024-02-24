import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

import ffmpeg from "fluent-ffmpeg";

const app = express();

const port = Number(process.env.PORT);

app.get("/", (request, response) => {
  response.send(`
        <h1>Hello World from Stryd Video Server</h1>
        <p>Processing fitness video one frame a time...  </p>
        <a href="/">Visit Upload </a>
    `);
});

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

  const fileName = file?.originalname.split(".")[1];

  try {
    const outputDirectory = "./uploads/egress/";
    const outputFileName = `${fileName}output.m3u8`; // HLS playlist file

    const command = ffmpeg(file?.path)
      .outputOptions("-hls_time 9") // Set the segment duration to 9 seconds
      .outputOptions("-hls_playlist_type vod") // Create a VOD (Video On Demand) playlist
      .outputOptions(
        `-hls_segment_filename ${path.join(outputDirectory, "segment%03d.ts")}`
      ) // Set the segment file names
      .output(path.join(outputDirectory, outputFileName)) // Output to output.m3u8
      .on("end", () => {
        console.log("File has been converted succesfully");
      })
      .on("error", (err) => {
        console.log("An error occurred: " + err.message);
      })
      .run();
    response.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
  }
});

const callback = () => console.log(`Listening on port ${port}`);

app.listen(port, callback);
