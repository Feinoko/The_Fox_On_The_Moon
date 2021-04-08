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

/* concept: play on opacity, current panel has opacity = 1, others = 0. As the user clicks arrows, the '1' opacity is switched between panels, using an array */

// variables:

// arrow cursors
const mobRightArrow_EL = document.querySelector('.new-in__mob-slider-right');
const mobLeftArrow_EL = document.querySelector('.new-in__mob-slider-left');

// the parent element
const parent_EL = document.querySelector('.new-in__title');

// the panels
const panels = document.querySelectorAll('.new-in__panels');
const numberOfPanels = panels.length;
console.log(`no. of panels: ${numberOfPanels}`);

// opacity controller, is an array with all indexes = 0 opacity, except the one active = 1 opacity
let opacityController = Array.from(Array(numberOfPanels)); // for maintainability, when changing collections maybe there will be 5 panels this time if Max is very creative, it needs to adapt
opacityController[0] = 1;
for (let i=1; i<opacityController.length; i++) {
  opacityController[i] = 0;
}
console.log(`this is the array containing the opacity values 'opacityController', equal to ${opacityController}`);

parent.onclick = (e) => {
  let indexOfCurrentVisiblePanel;
  if(e.target === mobRightArrow_EL) {
    // finding the index that is equal to 1...
    opacityController.forEach((opacity, index) => {
      if(opacity === 1) {
        indexOfCurrentVisiblePanel = index;
        console.log(`panel no. ${indexOfCurrentVisiblePanel+1} is currently visible`);
      }
    })
    // ... and updating the opacityController by assigning the 1 to the next index (=the next panel)...
    opacityController.forEach((opacity, index, arr) => {
      arr[index] = 0;
    })
    console.log(`opacityController should be set to all zeros... : ${opacityController}`);
    opacityController[indexOfCurrentVisiblePanel+1] = 1;
    console.log(`and adding '1' to the next index... : ${opacityController}`);
    // ...then assigning the opacity to the elements
    for (let i = 0; i < panels_EL.length; i++) {
      panels_EL[i].style.opacity = `${opacityController[i]}`;
      console.log(`panel no. ${i+1} has opacity = ${panels_EL[i].style.opacity}`);
    }

  }
}

