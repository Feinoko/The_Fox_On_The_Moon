

/* =========================
 NEW-IN CAROUSEL INTERACTIONS
 ===========================  */

/* ========
Table of Contents:
1.  Desktop navigation
2.  Mobile navigation
3.  Resets
============ */








/* =====
Desktop navigation
====== */

const slider_EL = document.querySelector('.new-in__slider');
const rightArrow_EL = document.querySelector('.new-in__right');
const leftArrow_EL = document.querySelector('.new-in__left');
const panels_EL = document.querySelectorAll('.new-in__panels');
const howManyPanels = panels_EL.length;

// keep record of number of clicks on right or left arrow, to determine limit after which event not triggered, due to user having reached end
let counter = 0;
let canSlideRight = true; // turns to false as user reached end of carousel, grays out arrow & disable event
let canSlideLeft = false; // by default carousel is at left end (origin) so user cannot slide left

// set default greyed out left arrow
leftArrow_EL.style.color = 'rgb(170, 170, 170)';

slider_EL.onclick = (e) => {

  panels_EL.forEach((panel) => {

    // get 'position' custom inline css var
    const panelPositionProperty = window.getComputedStyle(panel);
    let position = Number(panelPositionProperty.getPropertyValue('--position'));

    // update 'position' custom inline css var on each panel (for next click):

    // -100% if click right arrow
    if (e.target.classList.contains('new-in__right')) {
      if (canSlideRight) { // allow event handler unless user has reached end of carousel
        canSlideLeft = true; // enables sliding left next time
        leftArrow_EL.style.color = '#173336'; // left arrow becomes clickable again
        position -= 50;
        panel.setAttribute('style', `--position:${position}`);
      }
      // +100% if click left arrow
    } else if (e.target.classList.contains('new-in__left')) {
      if (canSlideLeft) { // allow event handler unless user has reached end of carousel
        canSlideRight = true; // enables sliding left next time
        rightArrow_EL.style.color = '#173336'; // right arrow becomes clickable again
        position += 50;
        console.log('position value: ' + position);
        panel.setAttribute('style', `--position:${position}`);
      }

    }

    // perform the translation
    const newPositionTranslate = `translateX(${position}%)`;
    console.log(position);
    panel.style.transform = newPositionTranslate;
  }) // end foreach

  // check if user has reached end panel:

  // if reached right limit
  if (e.target.classList.contains('new-in__right')) {
    counter++;
    console.log(`counter: ${counter}`);
    if (counter >= howManyPanels - 1) {
      counter = howManyPanels - 1;
      canSlideRight = false;
      console.log(`canSlideright set to false`);
      rightArrow_EL.style.color = 'rgb(170, 170, 170)';
    }
  }
  // if reached left limit
  if (e.target.classList.contains('new-in__left')) {
    counter--;
    console.log(`counter: ${counter}`);
    if (counter <= 0) {
      counter = 0;
      canSlideLeft = false;
      console.log(`canSlideleft set to false`);
      leftArrow_EL.style.color = 'rgb(170, 170, 170)';
    }
  }

}











/* ==========
 Mobile navigation 
 ========= */

/* concept: play on opacity, the parent panel always has opacity = 1, and the others by default 0. As the user clicks arrows, children panels get opacity from 0 to 1, in turn, using an array */

// variables:

// arrow cursors
const mobRightArrow_EL = document.querySelector('.new-in__mob-slider-right');
const mobLeftArrow_EL = document.querySelector('.new-in__mob-slider-left');

// the parent element
const parent_EL = document.querySelector('.new-in__title');

// the panels
const panels = document.querySelectorAll('.new-in__card-container .new-in__panels');
const numberOfPanels = panels.length;
console.log(`no. of panels: ${numberOfPanels}`);

// opacity controller for children panels, is an array with all indexes set to 0 opacity by default
let opacityController = Array.from(Array(numberOfPanels)); // for maintainability, when changing collections maybe there will be 5 panels this time if Max is very creative ;), it needs to adapt
// setting default 0 values
for (let i = 0; i < opacityController.length; i++) {
  opacityController[i] = 0;
}
console.log(`this is the array containing the opacity values 'opacityController', equal to ${opacityController}`);

// keep record of number of clicks on right or left arrow, to determine limit after which event not triggered, due to user having reached end
counter = 0;
canSlideRight = true; // turns to false as user reached end of carousel, grays out arrow & disable event
canSlideLeft = false; // by default carousel is at left end (origin) so user cannot slide left

// set default greyed out left arrow
mobLeftArrow_EL.style.color = 'rgb(170, 170, 170)';


// event handler

parent.onclick = (e) => {
  let indexOfTargetPanel = -1;

  // sliding to right

  if (e.target === mobRightArrow_EL) {

    // allow event handler unless user has reached end of carousel
    if (canSlideRight) {

      canSlideLeft = true; // enables sliding left next time

      // finding the index that is equal to 1 (if any, by default there is none as all children panels are 0 opacity)...
      opacityController.forEach((opacity, index) => {
        if (opacity === 1) {
          indexOfTargetPanel = index;
          console.log(`panel no. ${indexOfTargetPanel + 1} is currently visible`);
        }
      })

      // if all indexes = 0, set the 1st panel to 1...
      if (indexOfTargetPanel === -1) {
        opacityController[0] = 1;
        console.log(`opacityController: ${opacityController}`);

        // else, set the next index to 1
      } else {
        opacityController[indexOfTargetPanel + 1] = 1;
        console.log(`opacityController: ${opacityController}`);
      }

      // ...then assigning the opacity to the elements (initial i=1 to exclude the parent who always has 1 opacity)
      for (let i = 1; i < panels_EL.length; i++) {
        panels_EL[i].style.opacity = `${opacityController[i - 1]}`;
        console.log(`panel no. ${i + 1} has opacity = ${opacityController[i - 1]}`);
      }

      mobLeftArrow_EL.style.color = '#173336'; // left arrow becomes clickable again

      // check if user has reached end panel
      counter++;
      console.log(`counter: ${counter}`);
      if (counter === numberOfPanels) {
        canSlideRight = false;
        console.log(`canSlideRight set to false`);
        mobRightArrow_EL.style.color = 'rgb(170, 170, 170)';
      }
    }
  }

  // sliding to left

  if (e.target === mobLeftArrow_EL) {
    if (canSlideLeft) {

      canSlideRight = true; // enables sliding right next time;

      // finding the index that is equal to 0 if any
      opacityController.forEach((opacity, index) => {
        if (opacity === 0) {
          indexOfTargetPanel = index;
          console.log(`panel no. ${indexOfTargetPanel + 1} is currently invisible`);
        }
      })

      // if all indexes = 1, set the last panel to 0...
      if (indexOfTargetPanel === -1) {
        opacityController[opacityController.length - 1] = 0;
        console.log(`opacityController: ${opacityController}`);
        // else, set the previous index to 0
      } else {
        opacityController[indexOfTargetPanel - 1] = 0;
        console.log(`opacityController: ${opacityController}`);
      }

      // ...then assigning the opacity to the elements (initial i=1 to exclude the parent who always has 1 opacity)
      for (let i = 1; i < panels_EL.length; i++) {
        panels_EL[i].style.opacity = `${opacityController[i - 1]}`;
        console.log(`panel no. ${i + 1} has opacity = ${opacityController[i - 1]}`);
      }

      mobRightArrow_EL.style.color = '#173336'; // right arrow becomes clickable again

      // check if user has reached end panel
      counter--;
      console.log(`counter: ${counter}`);
      if (counter === 0) {
        canSlideLeft = false;
        console.log(`canSlideLeft set to false`);
        mobLeftArrow_EL.style.color = 'rgb(170, 170, 170)';
      }
    }
  }
}









/* ====================
 resets when switching from desktop/mobile version 
 ====================== */

// variables
const mediaQuery = window.matchMedia('(max-width: 500px)');
let wasMobile; // below value-resets occur only if viewport was in mobile mode 1st (reverting from mobile)

// listen for window resize
window.addEventListener('resize', propertyResetter);

// media query, trigger when screen below 500px
function propertyResetter() {

  // resets translates, resets carousel position to origin by resetting opacity (1st panel has 1, others have 0)
  if (mediaQuery.matches) {
    console.log('hello');
    panels_EL.forEach((panel) => {
      panel.style.transform = 'translateX(0)';
      panel.style.opacity = '0';
      wasMobile = true;
    })
    panels_EL[0].style.opacity = '1';

    // counter keeps tracks of whether user has reached end of carousels (to grey out arrow and prevent further sliding)
    counter = 0;
  }

  // reset translateX inline css & custom var --translate to initial value in case user enlarges screen again above 500px (otherwise messes up slider system panels)
  if (wasMobile && !mediaQuery.matches) {
    console.log('reverted to wide / panel mode');
    let translateInitialValue = 0;
    let position = 0;
    panels_EL.forEach((panel) => {
      panel.style.transform = `translateX(${translateInitialValue}%)`;
      translateInitialValue += 100;
      panel.setAttribute('style', `--position:${position}`);
      position += 100;

      // some panels have been set to 0 opacity if user had used slider on mob viewport, so they must all be visible if reverting to desktop mode
      panel.style.opacity = '1';
      // counter that keeps tracks of whether user has reached end of carousels (to grey out arrow and prevent further sliding)
      counter = 0;
    })
  }
}



