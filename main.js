/*
Fly a paraglider.  This is a Sunday afternoon project. Oct 9, 2021
just for fun.  concept and implementation by John Henckel.
*/
// NOTE!!!
// 1 unit = 6cm, 5 units = 1 foot, 16 units = 1 meter, 100 units = 20 feet.

// GLOBALS
let w = 100,
  h = 100,
  scale = 1,
  pi = Math.PI;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let glider = {
  x: 100,
  height: 100,
  tilt: 0
};
let grass; // pattern
let cz = 100;
let current;
let timer = null;

canvas.addEventListener("mousemove", updateXY, false);
canvas.addEventListener("touchmove", updateXY);
canvas.addEventListener("mousewheel", onWheel);
document.addEventListener("keydown", onKeyDown);

function onResize() {
  w = window.innerWidth - 50;
  h = window.innerHeight - 50;
  canvas.width = w;
  canvas.height = h;
  // Initialize scale so that the shortest dimension (w or h) is 1000
  scale = Math.min(w, h) / 250.0;
  onDraw();
}

window.onresize = onResize;
window.onload = onLoad;

function onLoad() {
  current = [];
  for (let i = 0; i < cz; ++i) current.push(new Array(cz).fill(0));

  loadImages();
  onResize();
  onDraw();

  timer = setInterval(animationStep, 50);
}

function loadImages() {
  let image = new Image();
  image.src =
    "https://p0.piqsels.com/preview/1002/230/546/topview-of-grass-lawn.jpg";
  image.onload = () => {
    grass = ctx.createPattern(image, "repeat");
    onDraw();
  };
}

function animationStep() {
  updateCurrent();
}

function updateCurrent() {
  // slightly change the wind currents!
}

function onDraw() {
  clear();
  ctx.setTransform(scale, 0, 0, -scale, 0, Math.max(h - scale * 30, h - 100));
  drawCurrent();
  drawGround();
  drawTruck(100, 0);
  drawRope();
  drawGlider(glider.x, glider.height);
}

function drawCurrent() {
  // draw the wind currents
}

function drawGround() {
  ctx.beginPath();
  ctx.fillStyle = grass || "darkgreen";
  ctx.fillRect(0, 0, w / scale, -50);
  ctx.stroke();
}

function drawTruck(x, y) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(x - 15, y + 5, 60, 8);
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(x + 15, y + 13, 20, 8);
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.fillStyle = "lightgray";
  ctx.arc(x, y + 5, 4, 0, 2 * pi); // The back tire is the "origin" of the truck
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 30, y + 5, 4, 0, 2 * pi);
  ctx.fill();
  ctx.stroke();
}

function drawRope() {}

function drawGlider(x, y) {
  // the pilot
  ctx.beginPath();
  ctx.fillStyle = "gray";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.arc(x - 4, y + 6, 2, 0, 2 * pi);
  ctx.fill();
  ctx.moveTo(x - 4, y + 5);
  ctx.lineTo(x - 2, y + 3);
  ctx.lineTo(x + 1, y);
  ctx.lineTo(x + 5, y + 4);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x + 12, y + 2);
  ctx.moveTo(x - 3, y + 3);
  ctx.lineTo(x - 1, y);
  ctx.lineTo(x + 2, y + 5);
  ctx.stroke();
  // the wing
  ctx.beginPath();
  ctx.strokeStyle = "darkred";
  ctx.fillStyle = "red";
  ctx.moveTo(x, y + 78);
  ctx.lineTo(x + 10, y + 74);
  ctx.lineTo(x + 10, y + 60);
  ctx.lineTo(x - 5, y + 60);
  ctx.lineTo(x - 20, y + 70);
  ctx.lineTo(x, y + 78);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // stripes on the wing
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 72);
  ctx.lineTo(x, y + 76);
  ctx.lineTo(x - 20, y + 68);
  ctx.moveTo(x + 10, y + 69);
  ctx.lineTo(x, y + 73);
  ctx.lineTo(x - 15, y + 66);
  ctx.moveTo(x + 10, y + 65);
  ctx.lineTo(x, y + 67);
  ctx.lineTo(x - 8, y + 61);
  ctx.stroke();
  // lines
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5;
  ctx.moveTo(x + 8, y + 60);
  ctx.lineTo(x + 2, y + 5);
  ctx.lineTo(x + 10, y + 60);
  ctx.moveTo(x - 3, y + 60);
  ctx.lineTo(x + 1.5, y + 5);
  ctx.lineTo(x - 5, y + 60);
  ctx.moveTo(x - 18, y + 67);
  ctx.lineTo(x + 1, y + 5);
  ctx.lineTo(x - 20, y + 70);
  ctx.stroke();
}

function clear() {
  ctx.beginPath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.stroke();
}

//================== OLD STUFF ==============================

function pickStartingPoint() {
  let v = dist(f, c) / r;
  if (v > 0.95) return add(c, mult(1 / v, sub(f, c)));
  if (points.length) return pickNearest();
  return { x: c.x, y: c.y - r };
}

function pickNearest() {
  let p = points[0];
  for (let i = 1; i < points.length; ++i)
    if (dist(f, p) > dist(f, points[i])) p = points[i];
  return p;
}

function nextPoint(p) {
  // test valid input
  if (n < 2) return p;
  // going clockwise fine the next point so that the area is total area / n.
  let A = (pi * r * r) / n;
  let theta = (2 * pi) / n;
  let q;
  let dt;
  for (let i = 0; i < 30; ++i, dt *= 0.5) {
    q = add(c, rotate(sub(p, c), theta));
    let B = areaSlice(p, q);
    if (i == 0) dt = Math.abs(A - B) / B;
    //console.log("loop " + i, B / A, dt, B);
    if (B > A * 1.0001) theta -= dt;
    else if (B < A * 0.9999) theta += dt;
    else break;
  }
  return q;
}

function area3(a, b, c) {
  // return the signed area of triangle abc.
  return 0.5 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
}

function areaSlice(p, q) {
  // return the area of the slice of pizza given two points on the edge
  let a = dist(p, q);
  return (
    area3(f, c, p) +
    area3(f, q, c) +
    r * r * Math.asin(Math.min(1, (0.5 * a) / r))
  );
}

// Basic vector math stuff

function dist(a, b) {
  return len(sub(a, b));
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function mult(n, a) {
  return { x: n * a.x, y: n * a.y };
}

function len(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function rotate(p, theta) {
  let s = Math.sin(theta);
  let c = Math.cos(theta);
  return { x: c * p.x + s * p.y, y: c * p.y - s * p.x };
}

//-------- MOUSE STUFF

function updateXY(e) {
  let p = e.touches ? e.touches[0] : e;
  let m = { x: p.clientX, y: p.clientY };
  //console.log(m);
}

function onWheel(e) {
  //console.log(e.wheelDelta, scale);
  if (scale > 0.01 && e.wheelDelta < 0) scale *= 0.8;
  else if (scale < 100 && e.wheelDelta > 0) scale *= 1.25;
  else return;
  onDraw();
}

function onKeyDown(e) {
  console.log("key down ", e.code, e.key);
  if (e.key == "a") glider.x -= 1;
  else if (e.key == "d") glider.x += 1;
  else if (e.key == "s") glider.height -= 1;
  else if (e.key == "w") glider.height += 1;
  else return;
  onDraw();
}
