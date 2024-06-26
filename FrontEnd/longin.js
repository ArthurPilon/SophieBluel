const loginForm = document.getElementById("loginform");
const loginButton = document.getElementById("login-form-submit");
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

  async function postJSON(data) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const data = { username: "example" };
  postJSON(data);
});

// recup email password du form
// envoi à l'API http://localhost:5678/api/users/login
// aide:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#body
// localsotrage du token (mdn localstorage pour la recherche)
