'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
//buttons
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

//  document.querySelectorAll('.nav__link').forEach(function(el){
//    el.addEventListener('click', function(e){
//      e.preventDefault()
//      const id = this.getAttribute('href')
//      console.log(id)
//      document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//    })
//  })

//event delegation
//add eventlistener to common parent
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // determine event origin using the event
  if (e.target.classList.contains('.nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //get section 1 coordinates
  //console.log(s1coords);
  //console.log(e.target.getBoundingClientRect());

  //scrolling
  // window.scrollTo({
  //   left:s1coords.left,
  //   top: s1coords.top + window.AbortController.pageYOffset,
  //   behaviour: 'smooth'
  // }) //use the coordinates to direct scroll

  section1.scrollIntoView({ behavior: 'smooth' });
});

//tabbed components
//1. select the elements

//3 tab content
//2. add eventlisteners using event delegation
//--faster than loops
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //console.log(clicked);
  if (!clicked) return;

  //remove active tab class from all the tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //add active tab class to the clicked tab
  clicked.classList.add('operations__tab--active');
  //activate content area by giving it "active class"
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animations on hover

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //clicked link
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    //find siblings from parents
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      //reduce opacity for other links except the clicked link
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
/*
alternative to bind method
nav.addEventListener('mouseover', function(e){
  handleHover(e, 0.5)
});
*/

//pass arguments into the handler function using bind
nav.addEventListener('mouseover', handleHover.bind(0.5));
//reset the opacity on mouse out
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation

//the position of the point where the nav should become sticky
//using intersection observer api
// const observerCallback = function(entries, observer){
// entries.forEach(entry=>{
//   console.log(entry)
// })
// }
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2], //%visibility of the target element that triggers
//   //the action
// }
// const observer = new IntersectionObserver(observerCallback, observerOptions)
// observer.observe(section1)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //height of the nav
});
headerObserver.observe(header);

// reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry)
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden')
});

// lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
//all images with "data src" attribute
const loading = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  //prevent event when not intersecting
  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    //remove the blur filter after loading image
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

/// building a slider
const slider = function () {
  


const slides = document.querySelectorAll('.slide');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currSlide = 0;
let maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');
// put the slides besides each other instead of on top of each other

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};


const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};


const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - currSlide)}%)`)
  );
};


//next slide
const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  //currslide =1, -100%, 0, 100%, 200%
  goToSlide(currSlide);
  activeDot(currSlide)
};

const prevSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activeDot(currSlide)
};

const init = function () {
  createDots()
  activeDot(0)
  goToSlide(0)
  
}
init()


btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//arrow left and right
document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') prevSlide();
});
//use dots to navigate
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('.dots__dot')) {
    console.log(DOT);
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activeDot(slide)
  }
});

}

slider()

/*

//DOM traversing
//selecting child elements
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight')); //selects spans - children of h1 elements
console.log(h1.childNodes);
console.log(h1.children); //selects direct children elements
h1.firstElementChild.getElementsByClassName.color = 'white';
h1.lastElementChild.getElementsByClassName.color = 'orangered';

//going upward: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)'; 
//closest finds the parent element

/// *** going sideways: siblings
console.log(h1.previousElementSibling)
console.log(h1.nextElementSibling)
console.log(h1.parentElement.children)
//manipulating siblings
const elnodes = [...h1.parentElement.children]
elnodes.forEach(function(el){
  if(el !== h1) el.style.transform = 'scale(0.5)'
})

//selecting html elements
console.log(document.documentElement); // selects the whole document
console.log(document.head); //-- selects the head
console.log(document.body); //--selects the body
console.log(document.getElementById('section---1'));
const header = document.querySelector('.header');

//creating and inserting elements
//--insertAdjacentHTML
const message = document.createElement('div'); //creates DOM element
message.classList.add('cookie-message');
//message.textContent =
message.innerHTML =
  'we use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';
//header.prepend(message);
//header.append(message);
//header.append(message.cloneNode(true)) //duplicates it
//header.after(message)
header.before(message);
//remove cookie message onclick
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//access stylesheet -- getComputedStyles(message).color
//change style modify stylesheet
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
/*
  //attributes
  const logo = document.querySelector('.nav__logo')
  console.log(logo.alt) // --- bankist logo
  console.log(logo.src)
  console.log(logo.className) // --nav__logo
  // change image alt
  logo.alt = 'beautiful minimalist logo'
  console.log(logo.alt)
  logo.setAttribute('company', 'bankist')
  console.log(logo.company)

  //data attributes
  //data attributes start with data
  console.log(logo.dataset.versionNumber) //--- 3.0

  //classList add, remove, contains, toggle --


  //smooth scrolling

  */

/*

const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
  // h1.removeEventListener('mouseenter', alertH1); // to remove eventlistener and make the function run only once
};
h1.addEventListener('mouseenter', alertH1);

//remove an eventlistener using setTimeout
setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)} )`;
  console.log(randomColor())
document.querySelector('.nav__link').addEventListener('click', function(e){
  //e.preventDefault()
  this.style.backgroundColor = randomColor()
  console.log('link', e.target)
})
document.querySelector('.nav__links').addEventListener('click', function(e){
  //e.preventDefault()
  this.style.backgroundColor = randomColor()
  console.log('container', e.target)
})
document.querySelector('.nav').addEventListener('click', function(e){
  //e.preventDefault()
  this.style.backgroundColor = randomColor()
  console.log('Nav', e.target)
})

//e.stopProgragation stops propagation of an event to parent elements

*/
