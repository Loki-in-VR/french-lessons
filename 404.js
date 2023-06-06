let user = undefined;
let colors = new Map();
let clickCounter = 0;
let timeoutId = undefined;

document.addEventListener('click', clickHandler);

function clickHandler() {
    if (typeof timeoutId === "number") {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        clickCounter = 0;
        timeoutId = undefined;
    }, 500);

    clickCounter++;

    if (clickCounter === 7) {
        document.removeEventListener('click', clickHandler)
        clearTimeout(timeoutId);

        document.body.style.backgroundColor = '#e0e0e0';
        document.body.innerHTML = '<div id="password-field"><label for="password" id="password-label">Enter your password</label><input type="password" id="password"></div>';
        document.getElementById('password').focus();

        document.addEventListener('keyup', verifyPassword);
    }
}

function verifyPassword() {
    const password = document.getElementById('password').value;

    if (password.length >= 12) {
        const verifyPasswordRequest = new XMLHttpRequest();
        verifyPasswordRequest.open('POST', 'verify-password', true);
        verifyPasswordRequest.addEventListener('load', (event) => {
            const verifyPasswordResponse = JSON.parse(event.target.response);
    
            if (verifyPasswordResponse !== false) {
                user = verifyPasswordResponse.user;
                verifyPasswordResponse.colors.forEach(colorObject => {
                    colors.set(colorObject.username, colorObject.color);
                });

                document.removeEventListener('keyup', verifyPassword);

                const revealWebsiteRequest = new XMLHttpRequest();
                revealWebsiteRequest.open('PUT', 'index.html', true);
                revealWebsiteRequest.addEventListener('load', (event) => {
                    document.body.innerHTML = event.target.response;

                    const script = document.createElement('script');
                    script.setAttribute('src', 'script.js');
                    document.body.append(script);
                });
                revealWebsiteRequest.send();
            }
        });
        verifyPasswordRequest.send(password);
    }
}
