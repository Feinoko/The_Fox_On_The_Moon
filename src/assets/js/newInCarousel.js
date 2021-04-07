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

// listen for window resize
window.addEventListener('resize', removeInlineTranslate);

// media query, trigger when screen below 500px
function removeInlineTranslate() {
  const mediaQuery = window.matchMedia('(max-width: 500px)');
  if(mediaQuery.matches) {
    console.log('hello');
    panels_EL.forEach((panel) => {
    panel.style.transform = 'translateX(0)';
    })
  } else {
    // reset css var to initial in case user enlarges screen again above 500px (messes up slider system panels)
    panels_EL.forEach((panel) => {
      
    })
  }
}