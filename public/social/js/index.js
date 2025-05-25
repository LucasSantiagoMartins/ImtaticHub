

menuIcon = document.querySelector('#menu-icon')
menuDiv = document.querySelector('#menu')
contentDiv = document.querySelector('#content')

menuIcon.addEventListener('click', () => {
  document.querySelector('#content').style.display = 'none'
  show('#menu')
    
})
document.querySelector('.fa-arrow-left').addEventListener('click', ()=>{
  document.querySelector('#menu').style.display = 'none'
  show('#content')
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



