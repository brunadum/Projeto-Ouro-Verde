const formLogin = document.getElementById("loginForm"); 

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede a página de recarregar

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!email || !senha) {
            alert("Por favor, preencha e-mail e senha.");
            return;
        }

        const payloadLogin = {
            email: email,
            senha: senha
        };

        try {
            const resposta = await fetch("http://localhost:8080/api/administradores/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payloadLogin)
            });

            if (resposta.ok) {
                localStorage.setItem("adminLogado", "true");
                window.location.href = "dashboard.html"; 
            } else {
                alert("Acesso Negado: E-mail ou senha incorretos.");
            }
        } catch (erro) {
            console.error("Erro na comunicação com o servidor:", erro);
            alert("Erro de conexão. O servidor Java está rodando?");
        }
    });
}