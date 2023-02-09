
// SWIPERS.JS 
const swiper = new Swiper('.swiper', {
    // Optional parameters
    effect: 'cards',
    cardsEffect: {
        slideShadows: true,
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    eventsTarget: 'swiper-slide',

    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        bulletElement: 'li',
        horizontalClass: 'n',
        verticalClass: 'index-container',
        currentClass: 'swiper-pagination-bullet-active',
        clickable: true,
        renderBullet: function (index, className) {
            var totalSlides = this.slides.length;
            return '<li class="' + className + '">Notes ' + (totalSlides - index) + '</li>';
        }
    },
});



// SETTING DU BLOCNOTES

const plusIcon = document.getElementById('plusIcon');
const trashIcon = document.getElementById('trashIcon');

const mainUl = document.getElementById('mainUl');
const allInput = document.querySelector('.main-input')
const inputText = document.getElementById('inputText');
const mainLabel = document.querySelector('.main-label')


// Bouton pour ajouter des notes
function addNote() {
    if (!inputText.value || inputText.value.trim().length == 0) {
        // Ajout de class pour animation
        if (mainLabel.classList.contains('anim-input-empty')) {
            mainLabel.classList.remove('anim-input-empty');
            mainLabel.classList.add('anim-input-empty');
        } else {
            mainLabel.classList.add('anim-input-empty');
            // timer pour remove la class empty
            let delay = 1000;
            setTimeout(function () {
                mainLabel.classList.remove('anim-input-empty');
            }, delay);
        }
    } else {
        // sinon, ajoute l'anim de validation
        inputText.classList.add('anim-input-add');

    // Setting du contenu de la card créé

        //ajout d'un p qui recoit le contenu de l'input textarea
        let newP = document.createElement('p');
        newP.classList.add("card-text");
        newP.textContent = inputText.value;

        //ajout d'un nouveau textarea invisible qui permettra de modifier le contenu
        let newInput = document.createElement('textarea');
        newInput.classList.add("card-input");
        newInput.setAttribute('placeholder', "Entrez vote nouveau texte ici ! (Si rien n'est saisi, aucune modification ne sera apportée)");

        //ajout du bouton submit, lui aussi invisible
        let newButton = document.createElement('button');
        newButton.classList.add("save-button")
        newButton.style.display = "none";
        newButton.textContent = 'Enregistrer';

        //ajout des composantes précédents dans chaque nouvelle card créé
        const newLi = document.createElement("li");
        newLi.classList.add('swiper-slide');
        newLi.setAttribute('id', '')
        newLi.appendChild(newP);
        newLi.appendChild(newInput);
        newLi.appendChild(newButton);
        mainUl.insertBefore(newLi, mainUl.firstChild);
        //method propre à swiperjs
        swiper.prependSlide(newLi);
        swiper.slideTo(0);
        // timer pour remove la classe
        let delay = 700;
        setTimeout(function () {
            inputText.classList.remove('anim-input-add');
            inputText.value = '';
        }, delay);
    }
}

//setting du bouton icon de modifs et listener qui fait apparaitre le nouveau textarea et le bouton submit
const modifIcon = document.getElementById('modifIcon');
modifIcon.addEventListener('click', function () {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const newInput = activeSlide.querySelector('.card-input');
    const newButton = activeSlide.querySelector('.save-button');
    newInput.style.display = "block";
    newButton.style.display = "block";
});


//bouton d'ajout de nouvelle note dans le slider
plusIcon.addEventListener('click', function () {
    addNote();
});

// pareil mais avec la touche entrée
inputText.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addNote();
    }
});



// Bouton pour supprimer toute les notes 
trashIcon.addEventListener('click', function () {
    const childUl = mainUl.querySelector('.swiper-slide')
    if (childUl === null) {
        return;
    } else if (window.confirm("ATTENTION ! Êtes-vous sûr de vouloir supprimer toutes les notes ?")) {
        swiper.removeAllSlides();
    }
});


// Animation du label du text area
const label = document.querySelector('.main-label')

inputText.addEventListener("focus", function () {
    label.style.transform = "translateY(-30px)";
    label.style.scale = "1.05";
});

inputText.addEventListener("blur", function () {
    label.style.transform = "translateY(0px)";
    label.style.scale = "1";
});


// Modification d'une note
const allCards = document.querySelectorAll('.swiper-slide');


// Pour chaque slide, je veux faire apparraitre mon textarea et monbouton sumbit du dessus (forEach)
allCards.forEach(card => {
    //listener qui s'active pour chaque card
    card.addEventListener('click', function () {
        // j'utilise un tableau vide pour instance avec la method indexOf, et j'utilise call pour indiquer le contexte de mon indexOf : comme ça 'this' fait référence à toutes mes cartes (allCards), et le résultat est la position de card dans mon tableau allCards
        if (swiper.activeIndex !== [].indexOf.call(allCards, card)) {
            return; // je coupe la fonction si mon activeIndex n'est pas strictement égal à la position de ma card
        }

        // je restylise mes 'ghost' elements
        const text = this.querySelector('.card-text');
        const input = this.querySelector('.card-input');
        const saveButton = this.querySelector('.save-button');
        text.style.display = 'none';
        input.style.display = 'block';
        saveButton.style.display = 'block';
        //je remplace le contenu du p de ma carte par le contenu de mon 'ghost' textarea
        input.value = text.textContent;
    });
});

//Listener du bouton submit
document.addEventListener('click', function (e) {
    //je coupe la fonction si mon target ne contient pas la classe save-button
    if (!e.target.classList.contains('save-button')) {
        return;
    }

    // je recupere le parent de mon submit button ainsi que les element du slide
    const slide = e.target.parentNode;
    const text = slide.querySelector('.card-text');
    const input = slide.querySelector('.card-input');
    const saveButton = slide.querySelector('.save-button');

    //je remplace le text et je fait disparaitre mes 'ghost' elements
    if (!input.value) {
        input.style.display = 'none';
        saveButton.style.display = 'none';
        return;
    } 
    text.textContent = input.value;
    text.style.display = 'block';
    input.style.display = 'none';
    saveButton.style.display = 'none';
});



// Suppression d'une note

//je set le bouton qui supprime la card active
const crossIcon = document.getElementById('crossIcon');
crossIcon.addEventListener('click', function () {
    if (swiper.slides.length > 0) {
    // j'utilise removechild
    const activeSlide = swiper.activeIndex;
    const slideElement = swiper.slides[activeSlide];
    const parentElement = slideElement.parentNode;
    parentElement.removeChild(slideElement);
    // j'utilise la method update de swiper pour actualiser la pagination et mettre à jour le dom
    swiper.update();
    }
});


//setting pour agrandir la note en double cliquant dessus

const slides = document.querySelectorAll('.swiper-slide');
slides.forEach(function (slide) {
    slide.addEventListener('dblclick', function () {
        if (slide.classList.contains('swiper-slide-active')) {
            slide.classList.toggle('large');
        }
    });
});