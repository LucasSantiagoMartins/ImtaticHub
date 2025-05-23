

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

function toggleDropdown() {
  show("#dropdownMenu");
}

   document.getElementById("dropdownMenu").addEventListener("mouseleave", () => {
  hide("#dropdownMenu");
});

    window.addEventListener("click", function (e) {
  const dropdown = document.getElementById("dropdownMenu");
  const button = document.querySelector(".dropdown-button");

  if (!dropdown.contains(e.target) && !button.contains(e.target)) {
    hide("#dropdownMenu");
  }
  document.querySelector(".dropdown-button").addEventListener("click", function (e) {
  e.stopPropagation(); // impede o clique de chegar no window
  show("#dropdownMenu");
});

});



