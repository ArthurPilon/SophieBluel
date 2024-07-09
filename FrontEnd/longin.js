const loginForm = document.getElementById("loginform");
const apiURL = "http://localhost:5678/api/";

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(10);

  const formData = new FormData(loginForm);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  console.log(11, formObject);

  async function postJSON() {
    try {
      const response = await fetch(apiURL + "users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      console.log("Success:", result);

      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      console.log("Stored Token:", storedToken);
      console.log("Stored UserId:", storedUserId);

      if (result.token) {
        window.location.href = "/index.html";
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
        //response.status != 200;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  postJSON();
});
