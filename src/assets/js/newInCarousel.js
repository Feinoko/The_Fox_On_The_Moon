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