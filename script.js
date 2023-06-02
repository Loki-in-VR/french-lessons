const title = document.querySelector('h1');
const form = document.querySelector('form');
const message = document.querySelector('textarea');

title.textContent = `Hi ${user}!`;
window.scrollTo(0, document.body.scrollHeight);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log(message.value);
    message.value = '';
});