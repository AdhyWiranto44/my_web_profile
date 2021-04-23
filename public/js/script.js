$(".nav-item, .goTop").on("click", function (e) {
    let href = $(this).attr("href");
    let hrefElement = $(href);

    $("html, body").animate(
        {
            scrollTop: hrefElement.offset().top - 80,
        },
        1250,
        "easeInOutExpo"
    );

    e.preventDefault();
});




/** Navbar on scroll function */
window.onscroll = windowScroll;

function windowScroll(e) {    
    const navbar = document.querySelector(".navbar");
    const goTop = document.querySelector(".goTop");
    const navbarClass = "navbar navbar-expand-lg navbar-light fixed-top";
    const goTopClass = "goTop btn btn-dark fixed-bottom ml-3 mb-2 rounded-circle shadow";
    let offset = window.pageYOffset;

    if (offset > 70) {
        navbar.style.filter = "drop-shadow(0 3px 2px rgba(42, 45, 48, 0.1))";
        navbar.style.backdropFilter = "blur(10px)";
        goTop.className = goTopClass;
    } else {
        navbar.style.filter = "";
        navbar.style.backdropFilter = "";
        goTop.className = goTopClass + " d-none";
    }
}




// Script Google Form
const form = document.forms['adhywiranto44-contact-me'];

form.addEventListener('submit', e => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbybrGlJZOJiqxnQCJQGZlLlfVC1chq7bPAbF9oxdMrTZrRXBcH4arSRHGKg-UfRY8cW/exec';
    const btnSend = document.querySelector(".btn-send");
    const btnLoading = document.querySelector(".btn-loading");
    const myAlert = document.querySelector(".my-alert");

    e.preventDefault();

    // ketika tombol submit diklik
    // tampilkan tombol loading, hilangkan tombol kirim
    btnLoading.classList.toggle("d-none");
    btnSend.classList.toggle("d-none");

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            // ketika tombol submit diklik
            // tampilkan tombol loading, hilangkan tombol kirim
            btnLoading.classList.toggle("d-none");
            btnSend.classList.toggle("d-none");

            // tampilkan alert sukses
            myAlert.classList.toggle("d-none");

            form.reset();

            console.log('Success!', response);
        })
        .catch(error => console.error('Error!', error.message));
});



// Script mengganti tema
const btnChangeTheme = document.querySelector(".btnChangeTheme");
const html = document.querySelector("html");
const hours = new Date().getHours();

btnChangeTheme.addEventListener("click", function(event) {
    if (html.dataset.colorMode === "light") {
        html.dataset.colorMode = "dark";
        btnChangeTheme.textContent = "Light Mode";
    } else {
        html.dataset.colorMode = "light";
        btnChangeTheme.textContent = "Dark Mode";
    }
})

if (hours > 4 && hours < 16) {
    html.dataset.colorMode = "light";
    btnChangeTheme.textContent = "Dark Mode";
} else {
    html.dataset.colorMode = "dark";
    btnChangeTheme.textContent = "Light Mode";
}