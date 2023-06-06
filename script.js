const title = document.querySelector('h1');
const messageList = document.getElementById('message-list');
const form = document.querySelector('form');
const message = document.querySelector('textarea');
const loadMoreBtn = document.getElementById('load-more-btn');

let messagesNumber = 10;

title.textContent = `Hi ${user}!`;
loadMessages();

loadMoreBtn.addEventListener('click', () => {
    messagesNumber += 10;
    loadMessages();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const createMessageRequest = new XMLHttpRequest();
    createMessageRequest.open('POST', 'create-message', true);
    createMessageRequest.addEventListener('load', (event) => {
        messageList.append(createNewMessage(JSON.parse(event.target.response)));
        window.scrollTo(0, document.body.scrollHeight);
    });
    createMessageRequest.send(JSON.stringify({ username: user, content: message.value }));

    message.value = '';
});

function createNewMessage(message) {
    message.date = new Date(message.date);
    message.date = message.date.toLocaleDateString('fr-FR') + ' ' + message.date.toLocaleTimeString('fr-FR');

    const messageContainer = document.createElement('li');
    messageContainer.classList.add('message-container');
    messageContainer.innerHTML = `<h2><em style="color: ${colors.get(message.username)}">${message.username}</em><span>${message.date}</span></h2><p>${message.content}</p>`;

    return messageContainer;
}

function loadMessages() {
    const loadMessagesRequest = new XMLHttpRequest();
    loadMessagesRequest.open('GET', `load-messages/${messagesNumber}`, true);
    loadMessagesRequest.addEventListener('load', (event) => {
        messageList.innerHTML = '';

        const messages = JSON.parse(event.target.response);

        messages.forEach(message => {
            messageList.prepend(createNewMessage(message));
        });

        window.scrollTo(0, document.body.scrollHeight);
    });
    loadMessagesRequest.send();
}