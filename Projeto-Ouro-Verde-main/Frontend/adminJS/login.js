const form =
document.getElementById("loginForm");

const errorMessage =
document.getElementById("errorMessage");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const senha =
    document.getElementById("senha").value;

    // TEMPORÁRIO

    if(
        email === "admin@ouroverde.com" &&
        senha === "123456"
    ){

        window.location.href =
        "dashboard.html";

    }else{

        errorMessage.classList.add("show");

    }

});