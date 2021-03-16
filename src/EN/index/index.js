import 'regenerator-runtime/runtime' // required when using async/await with parcel
import '../../css/styles.scss' // styles entry point
// import '../../css/media-queries/responsive-main-header.scss' // media queries

/* mobile navigation */

const overlay_EL = document.querySelector('.site-header__mobile-overlay');
const burger_EL = document.querySelector('.site-header__burger');

burger_EL.addEventListener('click', () => {

  overlay_EL.classList.toggle('site-header__mobile-overlay--transition');

  // burger morph infographics
  burger_EL.classList.toggle('site-header__burger--transition');

})