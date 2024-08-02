// Function to add a ChatGPT button to the toolbar in each JupyterLab cell
function addChatGPTButtonToToolbar() {
    document.querySelectorAll('.jp-Toolbar.jp-cell-toolbar').forEach(toolbar => {
        if (!toolbar.querySelector('.open-chatgpt-button')) {
            const button = document.createElement('button');
            button.className = 'jp-ToolbarButtonComponent jp-CommandToolbarButton open-chatgpt-button';
            button.style.background = 'none';
            button.style.border = 'none';
            button.style.padding = '4px 8px'; // Adjust padding to match other buttons
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="sharpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#333;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#sharpGradient)"/>
                    <circle cx="12" cy="12" r="6" fill="#fff"/>
                    <circle cx="12" cy="12" r="3" fill="#000"/>
                </svg>
            `;
            button.title = 'Open ChatGPT with Cell Content and Output';
            button.addEventListener('click', () => {
                const cell = toolbar.closest('.jp-Notebook-cell');
                const outputArea = cell.querySelector('.jp-OutputArea-output');
                const codeArea = cell.querySelector('.cm-content'); // Selector for the code editor content
                let chatGPTQuery = '';

                chrome.storage.local.get(['codePrefix', 'errorSuffix'], (data) => {
                    const codePrefix = data.codePrefix || 'Here is my python code:';
                    const errorSuffix = data.errorSuffix || 'Here is my error message, please provide the corrected code:';

                    if (codeArea) {
                        const codeLines = codeArea.querySelectorAll('.cm-line');
                        const codeText = Array.from(codeLines).map(line => line.textContent.trim()).join(' ');
                        chatGPTQuery = codePrefix + ' ' + codeText;
                    }

                    if (outputArea) {
                        const outputText = outputArea.querySelector('pre').textContent;
                        chatGPTQuery += ' ' + errorSuffix + ' ' + outputText.trim().replace(/\n/g, ' ');
                    }
                    if (chatGPTQuery) {
                        window.open(`https://chatgpt.com/?model=auto&q=${encodeURIComponent(chatGPTQuery)}`);
                    } else {
                        console.error('No content found in cell.');
                    }
                });
            });

            toolbar.appendChild(button);
        }
    });
}

// Function to setup a MutationObserver to monitor JupyterLab for new toolbar additions
function setupChatGPTObserver() {
    const notebookPanel = document.querySelector('.jp-Notebook');
    if (notebookPanel) {
        const observer = new MutationObserver(() => {
            addChatGPTButtonToToolbar();
        });
        observer.observe(notebookPanel, { childList: true, subtree: true });
        addChatGPTButtonToToolbar(); // Also add buttons initially on script load
        console.log('ChatGPT Observer set up successfully.');
    } else {
        console.error('JupyterLab notebook panel not found. Retrying...');
        setTimeout(setupChatGPTObserver, 1000);
    }
}

setupChatGPTObserver();
