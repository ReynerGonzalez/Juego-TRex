//LISTENERS
//Evento para que cuando se presione la barra espaciadora, salte nuestro personaje
document.addEventListener("keydown", function (evento) {
  if (evento.keyCode == 32) {
    console.log("salta");
    if (nivel.muerto == false) {
      saltar();
    } else {
      nivel.velocidad = 9;
      nube.velocidad = 1;
      nivel.muerto = false;
      cactus.x = ancho + 100;
      nube.x = ancho + 100;
      nivel.marcador = 0;
    }
  }
});

//dimensiones del canvas
var ancho = 700;
var alto = 300;
//Cargar imagenes
var imgRex, imgNube, imgCactus, imgSuelo;
function cargaImagenes() {
  imgRex = new Image();
  imgNube = new Image();
  imgCactus = new Image();
  imgSuelo = new Image();

  imgRex.src = "img/dino.png";
  imgNube.src = "img/nube.png";
  imgCactus.src = "img/cactus.png";
  imgSuelo.src = "img/land.png";
}
////////////////////////
//PROPIEDADES
var suelo = 200;
var trex = {
  y: suelo, // eje vertical del dino
  vy: 0, // velocidad vertical
  gravedad: 2,
  salto: 28, //los pixeles que subira de golpe al principio
  vymax: 9, //velocidad maxima a la que vaya, para que no se acelere hasta el infinito
  saltando: false, //si el dino esta en el aire se aplica gravedad, sino, no
};
var nivel = {
  velocidad: 9, //vel del suelo y el cactus
  marcador: 0,
  muerto: false,
};
var cactus = {
  x: ancho + 100, //no se va a ver el inicio, le damos la anchura del canvas + 100px mas para que no se vea
  y: suelo - 25,
};
var nube = {
  x: 400,
  y: 100,
  velocidad: 1,
};
var suelog = {
  x: 0,
  y: suelo + 30,
};
/////////////////////////////////
//MOSTRAR EN PANTALLA LOS ELEMENTOS A INTERACTUAR
//Dino aparece en acccion
function dibujaDino() {
  //los primeros dos parametros son del contexto
  //los 2dos parametros son el tamaño real de la imagen del dinosauro 40 de ancho x 43 de alto
  //los 3ros parametros son donde se va a posicionar el dino
  //con que tamaño queremos que aparesca el dino si queremos rescalarlo
  ctx.drawImage(imgRex, 0, 0, 40, 43, 100, trex.y, 50, 50);
}
//Cactus en accion
function dibujaCactus() {
  ctx.drawImage(imgCactus, 0, 0, 23, 46, cactus.x, cactus.y, 38, 75);
}
//Nube en accion
function dibujaNube() {
  ctx.drawImage(imgNube, 0, 0, 48, 26, nube.x, nube.y, 82, 31);
}
//Suelo en acccion
function dibujaSuelo() {
  ctx.drawImage(imgSuelo, suelog.x, 0, 700, 30, 0, suelog.y, 700, 30);
}
///////////////////////////
//Logica del cactus
function logicaCactus() {
  //aparece por la pantalla, se mueve a la velocidad del nivel y
  //cuando pase la posicion de 0 (salga de pantalla izq)
  //se actualizara para que vuelva a aparecer por la derecha
  if (cactus.x < -100) {
    cactus.x = ancho + 100;
    nivel.marcador++;
  } else {
    cactus.x -= nivel.velocidad;
  }
}
//Logica NUBE
function logicaNube() {
  if (nube.x < -100) {
    nube.x = ancho + 100;
  } else {
    nube.x -= nube.velocidad;
  }
}
//Logica SUELO
function logicaSuelo() {
  if (suelog.x > 700) {
    suelog.x = 0;
  } else {
    suelog.x += nivel.velocidad;
  }
}
//Activamos y desactivamos el salto del dino
function saltar() {
  if (trex.saltando == false) {
    trex.vy = trex.salto;

    trex.saltando = true;
  }
}
//Aplicamos la gravedad del salto al dino cuando esta en el aire
function gravedad() {
  if (trex.saltando == true) {
    //para que el dino no pase del suelo
    if (trex.y - trex.vy - trex.gravedad > suelo) {
      trex.saltando = false;
      trex.vy = 0;
      trex.y = suelo;
    } else {
      //sino implementa la gravedad
      trex.vy -= trex.gravedad;
      trex.y -= trex.vy;
    }
  }
}

//LA COLISION
function colision() {
  if (cactus.x >= 100 && cactus.x <= 150) {
    if (trex.y >= suelo - 25) {
      nivel.muerto = true;
      nivel.velocidad = 0;
      nube.velocidad = 0;
    }
  }
}

// PUNTUACION
function puntuacion() {
  ctx.font = "38px impact";
  ctx.fillStyle = "#555555";
  ctx.fillText(`${nivel.marcador}`, 600, 50);
  if (nivel.muerto == true) {
    ctx.font = "38px impact";
    ctx.fillText(`GAME OVER`, 240, 150);
  }
}
////////////////////////////////////

// para que el canvas inicie
function inicializa() {
  canvas = document.querySelector("#canvas");
  //le decimos como se va a ver el entorno
  ctx = canvas.getContext("2d");
  //aca es donde estan cargadas las imagenes del dino, cactus,etc
  cargaImagenes();
}

function borraCanvas() {
  canvas.width = ancho;
  canvas.height = alto;
}

// BUCLE PRINCIAPL
var FPS = 50;
//cuantos - fps, mas lento,
//cuantos + fps, mas rapido
//Cada cuanto tiempo se tiene que ejecutar la funcion princiapl
setInterval(function () {
  principal();
}, 1000 / FPS);

//aca es donde se va a ir dibujando al dinosaurio, el suelo, el cactus, las nubes,etc
//en la posicion que le corresponda en cada momento
//la func principal es la que va a reunir a todas las acciones del juego
function principal() {
  borraCanvas();
  gravedad();
  colision();
  logicaSuelo();
  dibujaSuelo();
  logicaCactus();
  logicaNube();
  dibujaCactus();
  dibujaNube();
  dibujaDino();
  puntuacion();
}
