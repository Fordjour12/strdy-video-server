const videoEl = document.getElementById("videoEl");
const inputFile = document.getElementById("inputFile");
const videoForm = document.getElementById("video-form");

inputFile.addEventListener("change", (event) => {
  if (event.target.files && event.target.files[0]) {
    const url = URL.createObjectURL(event.target.files[0]);
    videoEl.src = url;
    videoEl.load();
  }
});

videoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(videoForm);
  fetch(videoForm.action, {
    method: "POST",
    body: formData,
  });
  // .then((response) => response.json())
  // .then((data) => {
  //   console.log(data);
  // });
});
