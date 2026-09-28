const loginForm = document.querySelector("#login-form, form");
const emailInput = document.querySelector(
  "#email, input[type='email']"
);
const passwordInput = document.querySelector(
  "#password, input[type='password']"
);

let loginMessage = document.getElementById("login-message");

if (!loginMessage) {
  loginMessage = document.createElement("p");
  loginMessage.id = "login-message";
  loginForm.appendChild(loginMessage);
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  loginMessage.textContent = "Giriş kontrol ediliyor...";
  loginMessage.style.color = "#72d2f4";

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (error) {
    console.error("Supabase giriş hatası:", error);

    loginMessage.textContent =
      "Gerçek hata: " + error.message;

    loginMessage.style.color = "#ff8d8d";
    return;
  }

  if (
    !data.user ||
    data.user.email.toLowerCase() !==
      "erensema908@gmail.com"
  ) {
    await supabaseClient.auth.signOut();

    loginMessage.textContent =
      "Bu hesap yönetim paneline yetkili değildir.";

    loginMessage.style.color = "#ff8d8d";
    return;
  }

  loginMessage.textContent =
    "Giriş başarılı. Yönetim paneli açılıyor...";

  loginMessage.style.color = "#72f4a1";

  window.location.href = "yonetim-paneli.html";
});