const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let eyeballs = [];
let theta;

let mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove',
function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

class Eyeball {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;        
    }
    draw(){
        // eyeball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
        // iris
        let iris_dx = mouse.x - this.x;
        let iris_dy = mouse.y - this.y;
        theta = Math.atan2(iris_dy, iris_dx);
        let iris_x = this.x + Math.cos(theta) * this.radius/10;
        let iris_y = this.y + Math.sin(theta) * this.radius/10;
        let irisRadius = this.radius / 1.2;
        ctx.beginPath();
        ctx.arc(iris_x, iris_y, irisRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
        // pupil
        let pupil_x = this.x + Math.cos(theta) * this.radius/1.9;
        let pupil_y = this.y + Math.sin(theta) * this.radius/1.9;
        let pupilRadius = this.radius / 2.5;
        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, pupilRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
        // reflection
        ctx.beginPath();
        ctx.arc(pupil_x - pupilRadius/3, pupil_y - pupilRadius/3, pupilRadius/3, 0, Math.PI * 2, true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
        // light
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y - 12);
        ctx.lineTo(mouse.x + 12, mouse.y + 12);
        ctx.lineTo(mouse.x - 12, mouse.y + 12);
        ctx.lineTo(mouse.x, mouse.y - 12);ctx.fillStyle = "gold";
        ctx.fill();
        ctx.closePath();
    }
    update(){

    }
        
}

function init() {
    eyeballs = [];
    let overlapping = false;
    let numberOfEyeballs = 600;
    let protection = 10000;
    let counter = 0;

    while ( eyeballs.length < numberOfEyeballs && counter < protection) {
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * 60) + 5
        };
        overlapping = false;
        for (let i = 0; i < eyeballs.length; i++) {
            let previousEye = eyeballs[i];
            let dx = eye.x - previousEye.x;
            let dy = eye.y - previousEye.y;
            let distance = Math.sqrt(dx*dx + dy*dy)
            if (distance < (eye.radius + previousEye.radius)) {
                overlapping = true;
                break;
            };
        }
        if (!overlapping) {
            eyeballs.push(new Eyeball(eye.x, eye.y, eye.radius))
        }
        counter++
    }
}

init();

function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < eyeballs.length; i++) {
        eyeballs[i].draw();
    }
}
animate();

window.addEventListener('resize',
function(){
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    init();
})