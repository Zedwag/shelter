const cards = document.querySelectorAll('.pets-card')
const pageBtns = document.querySelectorAll('.pets-navigation__button')
const modal = document.querySelector('.modal')
const modalImage = document.querySelector('.modal__image')
const modalWrapper = document.querySelector('.modal__wrapper')
const modalContent = document.querySelector(('.modal__content'))
const modalCloseBtn = document.querySelector(('.modal__close-button'))
const burgerBtn = document.querySelector('.burger')
const burgerMenu = document.querySelector('.burger-menu')
const burgerLogo = document.querySelector('.burger-logo')
const headerLogo = document.querySelector('.logo')
const darkScreen = document.querySelector('.burger-dark_overlay')

let modalCloseByClick = false
let isAnimationStop = true
let isBurgerOpen = false

let cardsOnPage = 8
let currentPage = 1
let pets = []
let allPets = []

fetch('../../assets/json/pets.json').then((res) => res.json()).then((jsonPets) => {
    //[0,1,2,3,4,5,6,7].sort(function(){ return 0.5-Math.random() });
    pets = jsonPets
    for (let i = 0; i < 6; i++) {
        const rndIndexes = [0,1,2,3,4,5,6,7].sort(() => 0.5-Math.random())
        rndIndexes.forEach(idx => allPets.push(pets[idx]))
    }
    calculateCardsAmount()
    fillCardsContent()
    addModalsToCards()
})

function checkBtnClasses() {
    if (currentPage === 1) {
        pageBtns[0].classList.add('pets-navigation__button-inactive')
        pageBtns[1].classList.add('pets-navigation__button-inactive')
        pageBtns[0].classList.remove('pets-navigation__button-normal')
        pageBtns[1].classList.remove('pets-navigation__button-normal')
    } else {
        pageBtns[0].classList.add('pets-navigation__button-normal')
        pageBtns[1].classList.add('pets-navigation__button-normal')
        pageBtns[0].classList.remove('pets-navigation__button-inactive')
        pageBtns[1].classList.remove('pets-navigation__button-inactive')
    }
    if (currentPage === (Math.ceil(48 / cardsOnPage))) {
        pageBtns[3].classList.toggle('pets-navigation__button-inactive')
        pageBtns[4].classList.toggle('pets-navigation__button-inactive')
        pageBtns[3].classList.toggle('pets-navigation__button-normal')
        pageBtns[4].classList.toggle('pets-navigation__button-normal')
    } else {
        pageBtns[3].classList.add('pets-navigation__button-normal')
        pageBtns[4].classList.add('pets-navigation__button-normal')
        pageBtns[3].classList.remove('pets-navigation__button-inactive')
        pageBtns[4].classList.remove('pets-navigation__button-inactive')
    }
}

function addModalsToCards() {
    cards.forEach((card, idx) => card.addEventListener('click', () => {
        if (idx >= cardsOnPage) return
        modal.style.display = 'flex'
        document.body.style.overflow = 'hidden'
        modalImage.src = card.firstChild.nextElementSibling.src
        const pet = pets.filter(el => el.name === card.childNodes[1].nextElementSibling.firstChild.nextElementSibling.innerHTML)
        modalContent.childNodes[1].innerHTML = pet[0].name
        modalContent.childNodes[3].innerHTML = `${pet[0].type} - ${pet[0].breed}`
        modalContent.childNodes[5].innerHTML = pet[0].description
        modalContent.childNodes[7].childNodes[1].innerHTML = `Age: ${pet[0].age}`
        const inoculations = `Inoculations: ` + (pet[0].inoculations.length ? pet[0].inoculations.join(',') : 'none')
        const diseases = `Diseases: ` + (pet[0].diseases.length ? pet[0].diseases.join(',') : 'none')
        const parasites = `Parasites: ` + (pet[0].parasites.length ? pet[0].parasites.join(',') : 'none')
        modalContent.childNodes[7].childNodes[3].innerHTML = inoculations
        modalContent.childNodes[7].childNodes[5].innerHTML = diseases
        modalContent.childNodes[7].childNodes[7].innerHTML = parasites
    }))
}

function fillCardsContent() {
    pageBtns[2].innerHTML = currentPage.toString()
    checkBtnClasses()

    cards.forEach((card, idx) => {
        if (idx >= cardsOnPage) return
        idx = (currentPage - 1) * cardsOnPage + idx
        const children = card.childNodes
        children[0].nextElementSibling.src = allPets[idx].img
        children[0].nextElementSibling.alt = allPets[idx].name
        children[1].nextElementSibling.firstChild.nextElementSibling.innerHTML = allPets[idx].name
    })
    addOpacity('1')
}

function calculateCardsAmount() {
    if (document.body.clientWidth >= 1280) cardsOnPage = 8
    else if (document.body.clientWidth >= 768) cardsOnPage = 6
    else cardsOnPage = 3
    cards.forEach((card, idx) => {
        if (idx + 1 > cardsOnPage) card.style.display = 'none'
    })
}

function addOpacity(opacity) {
    cards.forEach(card => card.style.opacity = opacity)
}

function openBurger() {
    if (isAnimationStop) {
        document.body.style.position = 'fixed'
        isAnimationStop = false
        darkScreen.style.display = 'block'
        burgerBtn.classList.remove('header__burger--close')
        burgerBtn.classList.add('header__burger--open')
        burgerMenu.style.display = 'block'
        burgerMenu.classList.add('burger__animation-in')
        burgerMenu.classList.remove('burger__animation-out')
        burgerLogo.classList.add('burger__logo--open')
        document.body.style.overflowY = 'hidden'
        setTimeout(() => headerLogo.style.opacity = '0', 1000)
        burgerLogo.addEventListener('animationend', () => {
            isAnimationStop = true
            isBurgerOpen = true
        })
    }

}

function closeBurger() {
    darkScreen.style.display = 'none'
    burgerBtn.classList.remove("header__burger--open")
    burgerBtn.classList.add("header__burger--close")
    burgerMenu.classList.remove('burger__animation-in')
    burgerMenu.classList.add('burger__animation-out')
    burgerLogo.classList.remove('burger__logo--open')
    headerLogo.style.opacity = '1'
    document.body.style.overflowY = 'visible'
    setTimeout(() => {
        burgerMenu.style.display = 'none'
        document.body.style.position = 'relative'
    }, 1500)
    isBurgerOpen = false
}

burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isBurgerOpen) {
        closeBurger()
    } else {
        openBurger()
    }
})

darkScreen.addEventListener('click', closeBurger)

modal.addEventListener('click', () => {
    if (modalCloseByClick) {
        modal.style.display = 'none'
        document.body.style.overflow = 'visible'
    }
})

modalWrapper.addEventListener('mouseover', () => {
    modalCloseByClick = false
})
modalWrapper.addEventListener('mouseout', () => {
    modalCloseByClick = true
})

modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none'
    document.body.style.overflow = 'visible'
})

pageBtns[0].addEventListener('click', () => {
    if (currentPage !== 1) {
        addOpacity('0')
        setTimeout(() => {
            currentPage = 1
            fillCardsContent()
        }, 500)
    }
})

pageBtns[1].addEventListener('click', () => {
    if (currentPage !== 1) {
        addOpacity('0')
        setTimeout(() => {
            currentPage--
            fillCardsContent()
        }, 500)
    }
})

pageBtns[3].addEventListener('click', () => {
    if (currentPage !== (Math.ceil(48 / cardsOnPage))) {
        addOpacity('0')
        setTimeout(() => {
            currentPage++
            fillCardsContent()
        }, 500)
    }
})

pageBtns[4].addEventListener('click', () => {
    if (currentPage !== (Math.ceil(48 / cardsOnPage))) {
        addOpacity('0')
        setTimeout(() => {
            currentPage = (Math.ceil(48 / cardsOnPage))
            fillCardsContent()
        }, 500)
    }
})

