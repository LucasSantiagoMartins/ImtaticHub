

menuIcon = document.querySelector('#menu-icon')
menuDiv = document.querySelector('#menu')
contentDiv = document.querySelector('#content')

menuIcon.addEventListener('click', () => {
    if (menuDiv.style.display != 'flex'){
        document.querySelector('#content').style.display = 'none'
        $('#menu').fadeIn(500)
        document.querySelector('#menu').style = 'display: flex;'
    }else{
        document.querySelector('#menu').style.display = 'none'
        $('#content').fadeIn()
    }
})

