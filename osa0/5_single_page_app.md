# 0.5 Single Page App

```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: 200 The HTML content for the SPA 
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: 200 The styles for the SPA 
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: 200 The js script for the SPA that activates interactivity
    deactivate server

    Note right of browser: Browser executes `spa.js` which fetches JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: 200 data.json with notes inside it `[{...},{...}...]`
    deactivate server

    Note right of browser: Browser updates the SPA UI with fetched JSON data
````