const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites: {
        avatar: document.getElementById('card_image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    playersSide: {
        player1: 'player-cards',
        player1Box: document.querySelector("#player-cards"),
        computer: 'computer-cards',
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {  
        button: document.getElementById('next-duel')
    },
}


const pathImage = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "Papel",
        img: `${pathImage}dragon.png`,
        winOf: [1, 3],
        loseOf: [2, 4],
    },
    {
        id: 1,
        name: "Cavaleiro Negro",
        type: "Pedra",
        img: `${pathImage}magician.png`,
        winOf: [2, 4],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exódia",
        type: "Tesoura",
        img: `${pathImage}exodia.png`,
        winOf: [0],
        loseOf: [1,3],
    },
    {
        id: 3,
        name: "Guardião Celta",
        type: "Pedra",
        img: `${pathImage}celta.png`,
        winOf: [2,4],
        loseOf: [0],
    },
    {
        id: 4,
        name: "Caveira Invocada",
        type: "Tesoura",
        img: `${pathImage}skull.png`,
        winOf: [0],
        loseOf: [1,3],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "150px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");
        
        if (fieldSide === state.playersSide.player1){
            cardImage.addEventListener ("mouseover", () => {
                drawSelectedCard(IdCard)
            })
            
            cardImage.addEventListener ("click", ()=>{
                setCardsField(cardImage.getAttribute("data-id"))
            })
        }


        return cardImage
}

async function setCardsField(cardId) {
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    await drawCardsInfield(cardId, computerCardId)
    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore ()
    await drawButton (duelResults)
}

async function drawCardsInfield (cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img
}

async function updateScore () {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton (text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function checkDuelResults (playercardId, computerCardId) {
    let duelResults = "Empate"
    let playerCard = cardData[playercardId]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "GANHOU!"
        state.score.playerScore++
        await playAudio ("win")
    } 

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "PERDEU!"
        state.score.computerScore++
        await playAudio("lose")
    }

    return duelResults
}

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playersSide
    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = `Atributo: ${cardData[index].type}`
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel () {
    state.cardSprites.avatar.src = "./src/assets/icons/card-back.png"
    state.actions.button.style.display = "none"

    init ()
}

async function playAudio(status) {
    
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

function init() {
    drawCards (5, state.playersSide.player1);
    drawCards (5, state.playersSide.computer);
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    state.cardSprites.name.innerText = "Selecione"
    state.cardSprites.type.innerText = "uma carta!"

    const bgm = document.getElementById("bgm")
    bgm.play
}

init ();
playAudio()