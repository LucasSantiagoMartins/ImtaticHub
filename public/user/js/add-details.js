document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    requestHandler(document.querySelector('form'), '/')
})