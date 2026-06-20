const logoutBtn =
document.getElementById("logoutBtn");

const modal =
document.getElementById("logoutModal");

const confirmLogout =
document.getElementById("confirmLogout");

const cancelLogout =
document.getElementById("cancelLogout");

logoutBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    modal.classList.add("show");

});

cancelLogout.addEventListener("click",()=>{

    modal.classList.remove("show");

});

confirmLogout.addEventListener("click",()=>{

    window.location.href =
    "login.html";

});