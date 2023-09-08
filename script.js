const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveAsImageBtn = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d"); // getContext() returns a drawing context on the canvas

// Setting global variables with default values
let previousMouseX,
  previousMouseY,
  snapshot,
  selectedTool = "brush",
  isDrawing = false,
  selectedColor = "#000",
  brushWidth = 5;

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; // setting filledColor back to the selected color , it'll be the brush color
};

//setting the height and width of the canvas
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// this function draws a rectangle
const drawRect = (e) => {
  //if the fill color isn't checked , draw a rectangle with no fill color
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      previousMouseX - e.offsetX,
      previousMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    previousMouseX - e.offsetX,
    previousMouseY - e.offsetY
  );
};

// This function draws a circle
const drawCircle = (e) => {
  ctx.beginPath(); //create path to draw a new circle
  // get the radius for the circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(previousMouseX - e.offsetX, 2) +
      Math.pow(previousMouseY - e.offsetY, 2)
  );
  ctx.arc(previousMouseX, previousMouseY, radius, 0, 2 * Math.PI); //the arc method is used by the canvas to create a circle
  fillColor.checked ? ctx.fill() : ctx.stroke(); // if the fill color is checked then fill the circle with color else just draw the circle with only stroke
};

// This function draws a Line  on the canvas
// const drawLine = (e) => {
//   ctx.beginPath(); //create path to draw a new triangle
//   ctx.moveTo(previousMouseX, previousMouseY); //this moves the path of the mouse pointer to a specific point on the canvas
//   ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
//   ctx.stroke();
// };

// this function draws a Triangle o the canvas
const drawTriangle = (e) => {
  ctx.beginPath(); //create path to draw a new triangle
  ctx.moveTo(previousMouseX, previousMouseY); //this moves the path of the mouse pointer to a specific point on the canvas
  ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
  ctx.lineTo(previousMouseX * 2 - e.offsetX, e.offsetY); // creating the bottom-line of the triangle
  ctx.closePath(); // this method draws the third line automatically
  fillColor.checked ? ctx.fill() : ctx.stroke(); // if the fill color is checked then fill the triangle with color else just triangle the circle with only stroke
};

const startDrawing = (e) => {
  isDrawing = true;
  previousMouseX = e.offsetX; // passing current mouseX position as previous X coordinate
  previousMouseY = e.offsetY; // passing current mouseY position as previous Y coordinate

  // copying the canvas data and passing it as a snapshot value , this prevents the dimensions of the image drawn from distorting
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

  ctx.beginPath(); // creating a new path to draw
  ctx.lineWidth = brushWidth; //passing brushWidth as line width
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
};

const drawing = (e) => {
  // if the selected tool is an eraser  then set the stroke style to white ;
  if (!isDrawing) return; //if isDrawing is false return from here
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data onto the canvas
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // create lines according to the mouse pointer
    ctx.stroke(); // Draw and fill  line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding a click event to all tool options
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); // passing the slider value as the brush size so user can set the brush size

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding a click event to all color options
    document.querySelector(".options .selected").classList.remove("selected"); // remove active class from previous color option
    //add an active class to the selected color
    btn.classList.add("selected");

    // passing the selected button background as the preferred color value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  // passing  picked color  value from color picker to last color button  background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the whole board
  setCanvasBackground();
});

saveAsImageBtn.addEventListener("click", () => {
  const link = document.createElement("a"); // create an <a> element
  link.download = `${Date.now()}.jpg`; // passing current date as link download value
  link.href = canvas.toDataURL(); // passing the canvas data as link href value
  link.click(); // clicking link to download the image
});

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
