const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let level=1;

const player={
    x:150,
    y:300,
    hp:100,
    speed:5
};

let keys={};

let bullets=[];
let enemies=[];

function createEnemies(){

    enemies=[];

    for(let i=0;i<level*5;i++){

        enemies.push({

            x:500+Math.random()*700,
            y:50+Math.random()*500,
            hp:1

        });

    }

}

createEnemies();

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

canvas.onclick=e=>{

    bullets.push({

        x:player.x,
        y:player.y,
        dx:(e.clientX-player.x)/20,
        dy:(e.clientY-player.y)/20

    });

}

function drawStickman(x,y,color){

ctx.strokeStyle=color;
ctx.lineWidth=3;

//頭
ctx.beginPath();
ctx.arc(x,y-20,10,0,Math.PI*2);
ctx.stroke();

//身體
ctx.beginPath();
ctx.moveTo(x,y-10);
ctx.lineTo(x,y+20);

//手
ctx.moveTo(x-12,y);
ctx.lineTo(x+12,y);

//腳
ctx.moveTo(x,y+20);
ctx.lineTo(x-10,y+40);

ctx.moveTo(x,y+20);
ctx.lineTo(x+10,y+40);

ctx.stroke();

}

function update(){

if(keys["w"])player.y-=player.speed;
if(keys["s"])player.y+=player.speed;
if(keys["a"])player.x-=player.speed;
if(keys["d"])player.x+=player.speed;

bullets.forEach((b,i)=>{

    b.x+=b.dx;
    b.y+=b.dy;

    enemies.forEach((e,j)=>{

        if(Math.hypot(b.x-e.x,b.y-e.y)<20){

            enemies.splice(j,1);
            bullets.splice(i,1);

        }

    });

});

enemies.forEach(e=>{

    let dx=player.x-e.x;
    let dy=player.y-e.y;

    let dis=Math.hypot(dx,dy);

    e.x+=dx/dis*1.2;
    e.y+=dy/dis*1.2;

    if(dis<20){

        player.hp-=0.2;

    }

});

if(player.hp<=0){

document.getElementById("gameOver").classList.remove("hide");

}

if(enemies.length==0){

level++;

if(level>5){

document.getElementById("win").classList.remove("hide");

}else{

createEnemies();

document.getElementById("level").innerText=level;

}

}

document.getElementById("hp").innerText=Math.floor(player.hp);

}

function draw(){

ctx.fillStyle="#000";
ctx.fillRect(0,0,canvas.width,canvas.height);

// Matrix雨
ctx.fillStyle="rgba(0,255,0,.15)";

for(let i=0;i<100;i++){

ctx.fillRect(Math.random()*canvas.width,Math.random()*canvas.height,2,10);

}

//玩家
drawStickman(player.x,player.y,"cyan");

//敵人
enemies.forEach(e=>{

drawStickman(e.x,e.y,"red");

});

//子彈

ctx.fillStyle="yellow";

bullets.forEach(b=>{

ctx.beginPath();

ctx.arc(b.x,b.y,3,0,Math.PI*2);

ctx.fill();

});

}

function gameLoop(){

update();

draw();

requestAnimationFrame(gameLoop);

}

gameLoop();
