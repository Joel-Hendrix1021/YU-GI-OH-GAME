const API_MOSTER =
  "https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&num=100&offset=0/";

const URL_IMG = 'https://storage.googleapis.com/ygoprodeck.com/pics_small'
let cardsRandomSequence = [];
let cardsIndex = 10;
let contador = 0;



let $section = document.querySelector('.section')
let btnIniciar = document.getElementById("btn");
let backCard = document.querySelectorAll(".back");
let dataMosterCards;
let time = document.getElementById('time')
let move = document.getElementById('moven')
///variables nuevas


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
    this.arrayCardById = []
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
    //this.crearImageConSequence(array);
    this.renderCardsMoster(array)
  }
  renderCardsMoster(n){
         $section.innerHTML = ''
         n.map((el, index)=>{
          const {id, name } = dataMosterCards[el]
          console.log(name)
          $section.innerHTML += `
          <div  class="container">
               <div data-id=${id} class="card ">
                   <div class="lado back">
                       <img src="${URL_IMG}/${id}.jpg" alt="${name}" />
                   </div>
                   <div  class="lado front">
                       <img  src="https://i.pinimg.com/originals/3d/a3/9c/3da39cea425e1fc2b8c7b01d7b0d6c5c.png"
                           alt="moster">
                   </div>
               </div>
           </div>
          `
         })
     this.addEventCardsMoster() 
  }

 //agrega los eventos click  a las cards moster
  addEventCardsMoster() {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card)=>{
      card.addEventListener('click', this.flipCardsMoster)
    })
  }
  
  //agregue la clase directo para poder voltear con el evento en el atributo o objeto path
  flipCardsMoster(e) { 
    this.arrayCardById.push(e.target.parentNode.parentNode)
    console.log(this.arrayCardById)
    let cardSelect = e.target.parentNode.parentNode
    if (this.arrayCardById.length===1){
       cardSelect.classList.add('card_rotate')
       this.removeEventCardsMoster(cardSelect)
    }else if(this.arrayCardById.length === 2){
       cardSelect.classList.add('card_rotate')
       this.removeEventCardsMoster(cardSelect)
       this.moveUser()
       this.compareCard(this.arrayCardById)
       this.arrayCardById = []
    }   
  }

  moveUser(){
    this.movement++
    move.innerText = `movimiento: ${this.movement}`
  }

  removeEventCardsMoster(ev) {
    ev.removeEventListener('click', this.flipCardsMoster)
    
  }

  compareCard(n) {
  
    if(n[0].dataset.id === n[1].dataset.id){
      console.log('las cartas son pares')
      setTimeout(() => {
        
      }, 2000);
      this.nextLevel()
    }else {
      console.log('las cartas son impares') 
      setTimeout(() => {
        n.forEach((e)=>{
          e.classList.remove('card_rotate')
          e.addEventListener('click',this.flipCardsMoster)
        })
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
 