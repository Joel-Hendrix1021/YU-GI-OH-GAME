const API_MOSTER =
  "https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&num=100&offset=0/";
let cardsRandomSequence = [];
let cardsIndex = 10;
let contador = 0;


let cards = document.querySelectorAll(".card");
let btnIniciar = document.getElementById("btn");
let backCard = document.querySelectorAll(".back");
let dataMosterCards;
let time = document.getElementById('time')
let move = document.getElementById('moven')
///variables nuevas

//aplicar eventos listener a las cards moster efecto rotate

btnIniciar.addEventListener("click", juegoNuevo);


 
  
 function juegoNuevo() {
    location.reload()
   
  }

/*==================contruccion del juego-=========== */
class Juego {
  constructor() {
    this.level = 10

  }
  

  initializeGame() {
    this.nivel = 1;
    this.getApiCards(API_MOSTER);
    this.flipCardsMoster = this.flipCardsMoster.bind(this);
    this.pairCards = []
    this.arrayCardSelect = []
    this.timeGame()
    this.movement = 0
	
  }
  timeGame(){
    let seconds = 1
    let minute = 0
    this.interval = setInterval(() => {

     if(seconds < 10){
        time.innerText = `0${minute} : 0${seconds}`
     }else if (seconds >= 10){
      time.innerText = `0${minute} : ${seconds}`

     } 
     if(seconds > 59){
       seconds = 1
       minute++
       time.innerText = `0${minute} : 0${seconds}`
     }
     
      seconds++
    },  1000);
      
  }

  //conexion a la api
  getApiCards = (url) => {
    fetch(url)
      .then((res) => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
      .then((res) => res.json())
      .then((res) => {
        dataMosterCards = [...res.data];
        this.getRandomSequence();
      });
  };

  //genera una la secuencia random de las 10 cartas y duplica la secuencia random

  getRandomSequence() {
    let array = new Array(cardsIndex)
      .fill(0)
      .map(() => Math.floor(Math.random() * (100 - 1) + 1));
    let sequence = [...array,...array];
    this.messArray(sequence)
  }

  // esta funcion desordena el array
  messArray(array) {
     array = array.sort(function () {
      return Math.random() - 0.5;
    });
    this.crearImageConSequence(array);
  }

  //esta funcion crear las etiquetas img les agregar las url y les coloca el un id a las cards 
 // para poder comparar
  crearImageConSequence(array){
    let dataMoster = []
    let cardList = array.map((num, index)=>{
      dataMoster.push(dataMosterCards[num])//array de 20 moster en pares
      let srcImg = dataMoster[index].card_images[0].image_url_small;
      let img = document.createElement("img");
      img.setAttribute("src", srcImg);
      backCard[index].appendChild(img);
      cards[index].setAttribute('id', num)
    })
    console.log(dataMoster)
   this.addEventCardsMoster()
    
  }
 //agrega los eventos click  a las cards moster
  addEventCardsMoster() {
    cards.forEach((card)=>{
      card.addEventListener('click', this.flipCardsMoster)
    })
  }
  
  //agregue la clase directo para poder voltear con el evento en el atributo o objeto path
  flipCardsMoster(ev) { 
     this.arrayCardSelect.push(ev.path[2])
    let cardSelect = ev.path[2]
    if (this.pairCards.length===0){
      this.pairCards[0] = cardSelect
      cardSelect.classList.add('card_rotate')
       this.removeEventCardsMoster(cardSelect)
    }else if(this.pairCards.length === 1){
      this.pairCards[1]= cardSelect
       cardSelect.classList.add('card_rotate')
       this.removeEventCardsMoster(cardSelect)
       this.moveUser()
       this.compareCard(this.pairCards, this.arrayCardSelect)
    }   
  }

  moveUser(){
    this.movement++
    move.innerText = `movimiento: ${this.movement}`
  }

  removeEventCardsMoster(ev) {
    ev.removeEventListener('click', this.flipCardsMoster)
    
  }

  compareCard(pairCards, cardSelect) {
    if(pairCards[0].id === pairCards[1].id){
      console.log('las cartas son pares')
      setTimeout(() => {
        this.pairCards = []
        this.arrayCardSelect = []
      }, 2000);
      this.nextLevel()
    }else {
      console.log('las cartas son impares') 
      setTimeout(() => {
        pairCards.forEach((e)=>{
          e.classList.remove('card_rotate')
        })
        cardSelect[0].addEventListener('click', this.flipCardsMoster)
        cardSelect[1].addEventListener('click', this.flipCardsMoster)
        this.pairCards = []
        this.arrayCardSelect = []
      }, 2000);
     
    }
  }
  nextLevel() {
    if(this.nivel < this.level){
      
      console.log(`nivel actual ${this.nivel}`)
      console.log('nextlevel')
      this.nivel++
    }else{
      console.log('ganaste')
      clearInterval(this.interval)
    }
  }

}

const juego = new Juego()
juego.initializeGame()
 