// Minimal Love Walk: no external UI/theme images required

const messages = [
  "Happy Birthday Hunnnn ❤️\nWishing you a year filled with love, prosperity, and endless joy.\nYou’ve made my life better in ways words can’t describe — thank you for taking birth and for being the most beautiful part of my world.",
  "When I see you, I see my safe place, my happiness, and my reason to smile.",
  "You’re not just in my heart — you are my heart.",
  "If I could give you anything in this life, it would be the ability to see yourself through my eyes… only then would you realize how truly special you are.",
  "Sometimes — well more than some 😂 — I feel like I don’t deserve you.\nBecause you are that perfect, most supportive, caring, loving, and responsible person I know.\nYou always put others’ needs ahead of your own.\nI know I don’t give you the time you deserve, but still, you stay with me.\nSo please… don’t ever leave.\nI love youuu ❤️",
  "Here’s to many more birthdays together… keep going up 🤍",
  "Your smile—and those irresistible lips—my forever weakness 🤭❤️",
  "The time I spent with you, hun, will never be forgotten — it’s etched deep in my heart.",
  "The little fights we had (never too serious 😂🤭) only made us closer.",
  "I still remember the first time we said “I love you” — my favorite forever moment.",
  "When I was about to move to a different nation, you were the reason I stayed — best decision ever 🤭🤭 NOD"
];

const photoKeys = ["p1","p2","p3","p4","p5","p6","p7","p1","p2","p3","p4"]; // reuse if 8–11 not provided

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 900,
  height: 506,
  physics: { default: "arcade", arcade: { gravity:{ y:0 } } },
  backgroundColor: "#0f1117",
  scene: { preload, create, update }
};
new Phaser.Game(config);

let player, target=null, moving=false, speed=165, stages=[], openBtns=[], modal, modalShown=false, worldHeight, finaleShown=false;

function preload(){
  const W = this.scale.width, H = this.scale.height;

  // Required assets: bg and girl
  this.load.image("bg","assets/bg.jpg");
  this.load.image("girl","assets/girl.png");

  // Photos (use what you have; missing ones will fall back)
  this.load.image("p1","assets/photos/photo1.jpg");
  this.load.image("p2","assets/photos/photo2.jpg");
  this.load.image("p3","assets/photos/photo3.jpg");
  this.load.image("p4","assets/photos/photo4.jpg");
  this.load.image("p5","assets/photos/photo5.jpg");
  this.load.image("p6","assets/photos/photo6.jpg");
  this.load.image("p7","assets/photos/photo7.jpg");
  this.load.image("p8","assets/photos/photo8.jpg");
  this.load.image("p9","assets/photos/photo9.jpg");
  this.load.image("p10","assets/photos/photo10.jpg");
  this.load.image("p11","assets/photos/photo11.jpg");
}

function create(){
  const W = this.scale.width, H = this.scale.height;
  const segment = H*1.05;
  worldHeight = H + segment*11 + 240;
  this.cameras.main.setBounds(0,0,W,worldHeight);
  this.physics.world.setBounds(0,0,W,worldHeight);

  // Tiled bg
  for(let y=0;y<worldHeight;y+=H){
    const bg=this.add.image(0,y,"bg").setOrigin(0,0);
    fit(bg,W,H,false);
    bg.setAlpha(0.98);
  }

  // Simple clouds as rounded rectangles (no external PNGs)
  for(let i=0;i<11;i++){
    const y = worldHeight - (segment*(i+1)) - 120;
    const cloud = pill(this, W*0.5, y, 460, 86, 30, 0xffffff, 0.12, 0xff8ab5, 0.25);
    const btn   = labelButton(this, W*0.5, y-44, "Open");
    btn.alpha = 0; btn.setData("idx", i);
    btn.on("pointerdown", ()=> showModal(this,i));
    stages.push(cloud); openBtns.push(btn);
  }

  // Player
  player = this.physics.add.image(W*0.5, worldHeight-150, "girl");
  player.setScale(0.8).setDepth(5).setCollideWorldBounds(true);
  this.tweens.add({targets:player, scale:0.82, duration:1200, yoyo:true, repeat:-1});

  // Tap to move
  this.input.on("pointerdown", p => moveTo(p.worldX, p.worldY));

  // Camera
  this.cameras.main.startFollow(player, true, 0.13, 0.13);

  // Tip
  const tip=this.add.text(W*0.5, worldHeight-70, "Tap above to move up. Reach a cloud → tap Open.", {color:"#fff", fontFamily:"Georgia, serif", fontSize:"18px"}).setOrigin(0.5).setDepth(6);
  this.tweens.add({targets:tip, alpha:0.25, duration:1200, yoyo:true, repeat:-1});

  // Modal
  createModal(this);
}

function update(){
  if(!moving||!target) return;
  const dx=target.x-player.x, dy=target.y-player.y;
  const d=Math.hypot(dx,dy);
  if(d<6){ moving=false; player.setVelocity(0,0); target=null; revealBtns(this); return; }
  const a=Math.atan2(dy,dx);
  player.setVelocity(Math.cos(a)*speed, Math.sin(a)*speed);
}

// Helpers
function moveTo(x,y){ if(y>player.y+140) y=player.y+140; target={x,y}; moving=true; }
function revealBtns(scene){
  for(let i=0;i<stages.length;i++){
    const d=Phaser.Math.Distance.Between(player.x,player.y,stages[i].x,stages[i].y);
    if(d<140 && openBtns[i].alpha===0){
      scene.tweens.add({targets:openBtns[i], alpha:1, y:openBtns[i].y-6, duration:250});
    }
  }
}

function createModal(scene){
  const W=scene.scale.width,H=scene.scale.height;
  modal=scene.add.container(0,0).setDepth(20).setVisible(false).setAlpha(0).setScrollFactor(0);
  const dim=scene.add.rectangle(0,0,W,H,0x000000,0.7).setOrigin(0).setInteractive();
  const panel=scene.add.rectangle(W*0.5,H*0.5,Math.min(W*0.9,820),Math.min(H*0.78,440),0x151827,0.96).setStrokeStyle(2,0xffa9c9,0.7).setRadius(16);
  const msg=scene.add.text(W*0.5,H*0.30,"",{color:"#fff",fontSize:"22px",fontFamily:"Georgia, serif",wordWrap:{width:Math.min(W*0.84,740)},align:"center",lineSpacing:8}).setOrigin(0.5);
  const photo=scene.add.image(W*0.5,H*0.58,"p1").setOrigin(0.5).setAlpha(0.98);
  dim.on("pointerdown",()=>hideModal(scene)); panel.on("pointerdown",()=>hideModal(scene));
  modal.add([dim,panel,msg,photo]); modal.msg=msg; modal.photo=photo;
}

function showModal(scene, idx){
  if(modalShown) return; modalShown=true;
  const key=photoKeys[idx];
  const exists = scene.textures.exists(key) && scene.textures.get(key).key!=="__MISSING";
  modal.photo.setTexture(exists?key:"p1");
  fit(modal.photo, scene.scale.width*0.72, scene.scale.height*0.42, true);
  modal.msg.setText(messages[idx]);
  modal.setVisible(true);
  scene.tweens.add({targets:modal, alpha:1, duration:220});
  if(idx===messages.length-1 && !finaleShown){
    modal.once("hide", ()=> finale(scene));
  }
}

function hideModal(scene){
  scene.tweens.add({targets:modal, alpha:0, duration:180, onComplete(){
    modal.setVisible(false); modalShown=false; modal.emit("hide");
  }});
}

// Finale without extra images
function finale(scene){
  if(finaleShown) return; finaleShown=true;
  const W=scene.scale.width,H=scene.scale.height;
  const g=scene.add.graphics().setScrollFactor(0).setDepth(30).setAlpha(0);
  const grd=g.createLinearGradient(0,0,0,H);
  grd.addColorStop(0,"#ffd1dc"); grd.addColorStop(1,"#bbe0ff");
  g.fillStyle(0xffffff,1); g.fillRect(0,0,W,H); g.alpha=0.95;
  scene.tweens.add({targets:g, alpha:1, duration:500});
  const t=scene.add.text(W*0.5,H*0.5,"Here’s to many more birthdays together. I love you more than words, more than time, more than forever. ❤️",
    {color:"#222",fontSize:"24px",fontFamily:"Georgia, serif",wordWrap:{width:Math.min(W*0.86,760)},align:"center",lineSpacing:8}
  ).setOrigin(0.5).setDepth(31).setScrollFactor(0).setAlpha(0);
  scene.tweens.add({targets:t, alpha:1, duration:700, delay:200});
}

// UI primitives
function pill(scene,x,y,w,h,r,fill,alpha,stroke,sa){
  const g=scene.add.graphics({x:x-w/2,y:y-h/2}).setDepth(1);
  g.fillStyle(fill,alpha); g.fillRoundedRect(0,0,w,h,r);
  g.lineStyle(2,stroke,sa); g.strokeRoundedRect(0,0,w,h,r);
  const img = scene.add.image(x,y, g.generateTexture(`pill_${x}_${y}`, w, h)).setDepth(1);
  g.destroy();
  return img;
}

function labelButton(scene,x,y,text){
  const w=120,h=40,r=18;
  const g=scene.add.graphics({x:x-w/2,y:y-h/2});
  g.fillStyle(0xffa9c9,0.9); g.fillRoundedRect(0,0,w,h,r);
  g.lineStyle(2,0xffffff,0.8); g.strokeRoundedRect(0,0,w,h,r);
  const key=`btn_${x}_${y}`; g.generateTexture(key,w,h); g.destroy();
  const img=scene.add.image(x,y,key).setInteractive({useHandCursor:true}).setDepth(2);
  scene.add.text(x,y,text,{color:"#2b1840",fontFamily:"Georgia, serif",fontSize:"18px"}).setOrigin(0.5).setDepth(3);
  return img;
}

function fit(img,maxW,maxH,contain=true){
  const rW=maxW/img.width, rH=maxH/img.height;
  const s=contain?Math.min(rW,rH):Math.max(rW,rH);
  img.setScale(s);
}
