import 'regenerator-runtime/runtime' // required when using async/await with parcel
import '../../css/styles.scss' // styles entry point

/* mobile navigation */

const overlay_EL = document.querySelector('.site-header__mobile-overlay');
const burger_EL = document.querySelector('.site-header__burger');

burger_EL.addEventListener('click', () => {

  // make mobile nav invisible after it is closed...
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




})