/* new-in carousel interaction */

const slider_EL = document.querySelector('.new-in__slider');
const rightArrow_EL = document.querySelector('.new-in__right');
const leftArrow_EL = document.querySelector('.new-in__left');
const panels_EL = document.querySelectorAll('.new-in__panels');

slider_EL.onclick = (e) => {

  panels_EL.forEach((panel) => {
    
    // get 'position' custom inline css var
    const panelPositionProperty = window.getComputedStyle(panel);
    let position = Number(panelPositionProperty.getPropertyValue('--position'));
    
    // update 'position' custom inline css var on each panel (for next click)
    // -100% if click right arrow
    if (e.target.classList.contains('new-in__right')) { 
      position -= 50;
      panel.setAttribute('style', `--position:${position}`);
    // +100% if click left arrow
    } else if (e.target.classList.contains('new-in__left')) { 
      position += 50;
      console.log('position value: ' + position);
      panel.setAttribute('style', `--position:${position}`);
    }
    
    // perform the translation
    const newPositionTranslate = `translateX(${position}%)`;
    console.log(position);
    panel.style.transform = newPositionTranslate;
  })
}


/* remove inline css variable on mobile version that controls translation (no more slider system) so that subsequent panels are not kept translated, in event that user slides panels then for some reason reduces screen size under 500px (switching from landscape to upright on mobile!) */

// variables
const mediaQuery = window.matchMedia('(max-width: 500px)');
let wasMobile; // below value-resets occur only if viewport was in mobile mode 1st (reverting from mobile)

// listen for window resize
window.addEventListener('resize', removeInlineTranslate);

// media query, trigger when screen below 500px
function removeInlineTranslate() {
  
  if(mediaQuery.matches) {
    console.log('hello');
    panels_EL.forEach((panel) => {
    panel.style.transform = 'translateX(0)';
    wasMobile = true;
    })
  } 
  // reset translateX inline css & custom var --translate to initial in case user enlarges screen again above 500px (otherwise messes up slider system panels)
  if(wasMobile && !mediaQuery.matches) {
    console.log('reverted to wide / panel mode');
    let translateInitialValue = 0;
    let position = 0;
    panels_EL.forEach((panel) => {
      panel.style.transform = `translateX(${translateInitialValue}%)`;
      translateInitialValue += 100;
      panel.setAttribute('style', `--position:${position}`);
      position += 100;
    })
  }
}


/* ==========
 mobile navigation 
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
let opacityController = Array.from(Array(numberOfPanels)); // for maintainability, when changing collections maybe there will be 5 panels this time if Max is very creative, it needs to adapt
// setting default 0 values
for (let i=0; i<opacityController.length; i++) {
  opacityController[i] = 0;
}
console.log(`this is the array containing the opacity values 'opacityController', equal to ${opacityController}`);

parent.onclick = (e) => {
  let indexOfCurrentVisiblePanel = -1; 
  if(e.target === mobRightArrow_EL) {
    // finding the index that is equal to 1 (if any, by default there is none as all children panels are 0 opacity)...
    opacityController.forEach((opacity, index) => {
      if(opacity === 1) {
        indexOfCurrentVisiblePanel = index;
        console.log(`panel no. ${indexOfCurrentVisiblePanel+1} is currently visible`);
      }
      // if all indexes = 0, set the 1st panel to 1...
      if(indexOfCurrentVisiblePanel === -1) {
        opacityController[0] = 1;
        console.log(`opacityController: ${opacityController}`);
      // else, set the next index to 1
      } else {
        opacityController[indexOfCurrentVisiblePanel+1] = 1;
        console.log(`opacityController: ${opacityController}`);
      }
    })
    // ...then assigning the opacity to the elements (initial i=1 to exclude the parent who always has 1 opacity)
    for (let i = 1; i < panels_EL.length; i++) {
      panels_EL[i].style.opacity = `${opacityController[i-1]}`;
      console.log(`panel no. ${i+1} has opacity = ${opacityController[i-1]}`);
    }

  }
}

