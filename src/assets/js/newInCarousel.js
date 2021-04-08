/* new-in carousel animation */

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

/* mobile navigation */

// arrow cursors
const mobRightArrow_EL = document.querySelector('.new-in__mob-slider-right');
const mobLeftArrow_EL = document.querySelector('.new-in__mob-slider-left');

// the parent element
const parent_EL = document.querySelector('.new-in__title');

// the panels
const panels = document.querySelectorAll('.new-in__panels');
const numberOfPanels = panels.length;
console.log(`no. of panels: ${numberOfPanels}`);

// opacity controller
const opacityController = Array.from(Array(numberOfPanels));
console.log(opacityController);
opacityController[0] = 1;
for (let i=1; i<opacityController.length; i++) {
  opacityController[i] = 0;
}
console.log(opacityController);

parent.onclick = (e) => {
  if(e.target === mobRightArrow_EL) {

  }
}

