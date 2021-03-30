import 'regenerator-runtime/runtime' // required when using async/await with parcel
import '../../css/styles.scss' // styles entry point

/** MOBILE NAVI **/



/* mobile main menu */

const overlay_EL = document.querySelector('.site-header__mobile-overlay');
const burger_EL = document.querySelector('.site-header__burger');

burger_EL.addEventListener('click', () => {


  // make mobile menu invisible after it is closed...
  if (overlay_EL.offsetWidth != 0) {
    overlay_EL.style.opacity = '0';
    // ... or visible if opening
  } else {
    overlay_EL.style.opacity = '1';
  }

  // slides in
  overlay_EL.classList.toggle('site-header__mobile-overlay--transition');

  // burger morph infographics
  burger_EL.classList.toggle('site-header__burger--transition');

  // remove also the submenu, if it is active
  if (sub_overlay_EL.offsetWidth != 0) {
    sub_overlay_EL.classList.remove('site-header__mobile-overlay--transition');
    sub_overlay_EL.style.opacity = '0';
  }
})




/* mobile sub menu */

const sub_overlay_EL = document.querySelector('.site-header nav:nth-child(2)');
// get shop (trigger)
const shop_EL = document.querySelector('#shop');

shop_EL.addEventListener('click', (e) => {

  // make mobile sub menu visible 
  sub_overlay_EL.style.opacity = '1';

  // slides in
  sub_overlay_EL.classList.add('site-header__mobile-overlay--transition');


  // retract
  // get return arrow
  const returnArrow_EL = document.querySelector('.sub-menu-return');
  // retract sub nav when click the arrow
  returnArrow_EL.addEventListener('click', () => {
    sub_overlay_EL.classList.remove('site-header__mobile-overlay--transition');
    sub_overlay_EL.style.opacity = '0';
  })
})


/* pick random hero colors // optionnal */
const root_EL = document.querySelector(':root');

// window.onload = randoBgColors();

function randoBgColors() {
  root_EL.style.setProperty('--colorHeaderBg1', randomColor());
  root_EL.style.setProperty('--colorHeaderBg2', randomColor());
  root_EL.style.setProperty('--colorHeaderBg3', randomColor());
  root_EL.style.setProperty('--colorHeaderBg4', randomColor());
}

function randomColor() {
  const colorPalette = ['#014d57', '#068596', '#7c1785', '#1963ed'];
  const index = Math.floor(Math.random() * colorPalette.length);
  console.log('index of colorPalette returned: ' + index);
  return colorPalette[index];
}
