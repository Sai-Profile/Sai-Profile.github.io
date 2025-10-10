function updateContent() {
    const textElement = document.getElementById('main-text');

    if (textElement.textContent.includes('from the HTML file')) {
        textElement.textContent = "SUCCESS! This text was changed by the script.js file!";
        textElement.style.color = '#dc3545';
    } else {
        textElement.textContent = "This content is from the HTML file. It will be styled by CSS and changed by JavaScript.";
        textElement.style.color = '#333';
    }
}

document.getElementById('updateButton').addEventListener('click', updateContent);
