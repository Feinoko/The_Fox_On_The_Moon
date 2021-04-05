/* new-in carousel animation */

const rightArrow = document.querySelector('.new-in__right');
const leftArrow = document.querySelector('.new-in__left');
const panels = document.querySelectorAll('.new-in__panels');

rightArrow.onclick = () => {
  panels.forEach((panel) => {
    const panelPositionProperty = window.getComputedStyle(panel);
    const position = panelPositionProperty.getPropertyValue('--position');
    console.log(`position of panel: ${position}`);
    const newPosition = `translateX(${position-100})`;
    console.log(newPosition);
    panel.style.transform = newPosition;
  })
}