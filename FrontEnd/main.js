const apiURL = "http://localhost:5678/api/";
const storedToken = localStorage.getItem("token");
let works = null;
let modal = null;
let filters = null;

console.log(18, document.body.classList);

if (storedToken) {
  document.body.classList.add("log");
} else {
  document.body.classList.remove("log");
}

async function loadGalleryData() {
  let data = await fetch(apiURL + "works");
  works = await data.json();
  let imgGalleryDiv = document.getElementById("img-gallery");
  imgGalleryDiv.innerHTML = "";

  works.forEach((work) => {
    const figureElem = document.createElement("figure");
    figureElem.classList.add("category" + work.categoryId);
    figureElem.dataset.id = work.id;

    const imgElem = document.createElement("img");
    imgElem.src = work.imageUrl;
    imgElem.alt = work.title;

    const figCaptionElem = document.createElement("figcaption");
    figCaptionElem.textContent = work.title;

    figureElem.appendChild(imgElem);
    figureElem.appendChild(figCaptionElem);

    imgGalleryDiv.appendChild(figureElem);
  });
}

async function loadFilters() {
  let data = await fetch(apiURL + "categories");
  console.log(3, data);
  filters = await data.json();
  let filtersDiv = document.querySelector(".filterslist");
  console.log(4, filters, filtersDiv);

  filters.forEach((filter) => {
    const liElem = document.createElement("li");

    const buttonElem = document.createElement("button");
    buttonElem.textContent = filter.name;
    buttonElem.setAttribute("id", "filter" + filter.id);
    buttonElem.classList.add("hidden_if_logged");
    buttonElem.dataset.categoryId = filter.id;

    filtersDiv.appendChild(liElem);
    liElem.appendChild(buttonElem);
  });
}

window.onload = async () => {
  await loadFilters();
  await loadGalleryData();
  await CreateModalFilters();

  let filtreObjets = document.querySelectorAll(".filterslist button");
  let imgGalleryDiv = document.getElementById("img-gallery");
  let figures = imgGalleryDiv.getElementsByTagName("figure");
  let buttonTous = document.getElementById("butontous");

  filtreObjets.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtreObjets.forEach((btn) => {
        btn.classList.remove("active");
      });
      btn.classList.add("active");

      const categoryId = btn.dataset.categoryId;

      Array.from(figures).forEach((figure) => {
        if (figure.classList.contains("category" + categoryId)) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }
      });
    });
  });

  buttonTous.addEventListener("click", () => {
    filtreObjets.forEach((btn) => {
      btn.classList.remove("active");
    });
    buttonTous.classList.add("active");

    Array.from(figures).forEach((figure) => {
      figure.style.display = "block";
    });
  });

  let logoutbutton = document.getElementById("logoutbutton");
  logoutbutton.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
};

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);

  loadModalGallery();
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);

  modal = null;

  location.reload();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

async function loadModalGallery() {
  const modalGalleryDiv = document.querySelector(".modal-gallery");
  modalGalleryDiv.innerHTML = "";

  works.forEach((item) => {
    const figureElem = document.createElement("figure");
    figureElem.dataset.id = item.id;

    const imgElem = document.createElement("img");
    imgElem.src = item.imageUrl;
    imgElem.alt = item.title;

    const trashButton = document.createElement("button");
    const trashIcon = document.createElement("i");

    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashButton.classList.add("trashicon");

    addDeleteWorkListener(trashButton, item.id, figureElem);

    figureElem.style.position = "relative";
    figureElem.appendChild(imgElem);
    figureElem.appendChild(trashButton);
    trashButton.appendChild(trashIcon);

    modalGalleryDiv.appendChild(figureElem);
  });
}

function addDeleteWorkListener(button, id, figureElem) {
  button.addEventListener("click", function () {
    deleteWork(id);
  });
}
const deleteWork = async function (id, figureElem) {
  const url = apiURL + "works/" + id;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + storedToken,
    },
  });
  if (response.ok) {
    await loadGalleryData();
    loadModalGallery();
  } else {
    console.error(
      "Erreur lors de la suppression de l'élément :",
      response.statusText
    );
  }
};

document
  .getElementById("buttontomodal2")
  .addEventListener("click", function () {
    document.querySelectorAll(".modal1").forEach(function (element) {
      element.style.display = "none";
    });

    document.querySelectorAll(".modal2").forEach(function (element) {
      element.style.display = "block";
    });
  });

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//faire que la flèche revienne à la page précédente.

document
  .getElementById("modal-returnbutton")
  .addEventListener("click", function () {
    document.querySelectorAll(".modal2").forEach(function (element) {
      element.style.display = "none";
    });

    document.querySelectorAll(".modal1").forEach(function (element) {
      element.style.display = "flex";
    });
  });

// ajouter photo
document
  .getElementById("modal-fileinput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("modal-container-add-pic");
    preview.innerHTML = "";

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(file.type)) {
        alert("Erreur : le fichier doit être une image (jpg, png)");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

const fileInput = document.getElementById("modal-fileinput");
const titleInput = document.getElementById("photoTitle");
const sendButton = document.getElementById("modal-sendbutton2");
let categorySelect = undefined;

//création du select
async function CreateModalFilters() {
  let modalSelect = document.getElementById("modal-select");
  modalSelect.innerHTML = "";

  // <select>
  const selectElem = document.createElement("select");
  selectElem.name = "Catégorie";
  selectElem.id = "modal-form-category";

  categorySelect = selectElem;
  categorySelect.addEventListener("change", checkFormValidity);

  // <option> vide
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "";
  selectElem.appendChild(defaultOption);

  // <option> pour chaque filtre
  filters.forEach((item) => {
    const createOption = document.createElement("option");
    createOption.value = item.id;
    createOption.textContent = item.name;

    selectElem.appendChild(createOption);
  });
  modalSelect.appendChild(selectElem);
}

// vérifier si tous les champs sont remplis
function checkFormValidity() {
  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  console.log("File:", file);
  console.log("Title:", title);
  console.log("Category:", category);

  if (
    file !== undefined &&
    title !== undefined &&
    title !== "" &&
    category !== undefined &&
    category !== ""
  ) {
    sendButton.disabled = false;
    sendButton.classList.remove("modal-sendbutton");
    sendButton.classList.add("modal-form-category-go");
    console.log("Button class:", sendButton.className);
  } else {
    sendButton.disabled = true;
    sendButton.classList.remove("modal-form-category-go");
    console.log("Button class:", sendButton.className);
  }
}

fileInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);

sendButton.addEventListener("click", function (event) {
  console.log("Bouton envoyer cliqué");

  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  console.log("Fichier:", file);
  console.log("Titre:", title);
  console.log("Catégorie:", category);

  const uploadData = new FormData();
  uploadData.append("image", file);
  uploadData.append("title", title);
  uploadData.append("category", category);

  // Envoyer les données à l'API
  fetch(apiURL + "works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + storedToken,
    },
    body: uploadData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Réponse de l'API:", data);
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi des données à l'API:", error);
    });
});
// Essayer de réccupérer les infos du form, les convertir en JSON, les transmettre

//On ne devrait pas avoir besoin de recharger la page pour voir que le projet a été supprimé. Assurez-vous donc de répondre à la question suivante :
//Comment retirer des éléments du DOM après avoir reçu la confirmation de la suppression de l’entrée en base de données ?
