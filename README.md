# STRYD VIDEO SERVER

This is a video server used for processing videos to make it easy to stream the on the client.

## HOW TO USE IT

Select a video and send it to the server. The server processes the video and save it to a storage bucket

## TECHNOLOGIES USED

Technologies uses to make this project is

- fluent-ffmpeg
- Express
- Bun

> ffmpeg is a powerful tool that can read audio and video files (in most formats), and convert them into other formats. It can also perform many other operations such as extracting audio from video files, resizing videos, and creating thumbnails.

> fluent-ffmpeg makes it easier to work with ffmpeg in Node.js by providing a more user-friendly API. It allows you to construct ffmpeg commands using JavaScript methods and objects, rather than having to construct complex command line strings.

```typescript
import ffmpeg from "fluent-ffmpeg";

ffmpeg("input.avi")
  .output("output.mp4")
  .on("end", () => {
    console.log("File has been converted succesfully");
  })
  .on("error", (err) => {
    console.log("An error occurred: " + err.message);
  })
  .run();
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
