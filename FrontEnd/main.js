const apiURL = "http://localhost:5678/api/";
const storedToken = localStorage.getItem("token");
let works = null;
let modal = null;

console.log(18, document.body.classList);

if (storedToken) {
  document.body.classList.add("log");
} else {
  document.body.classList.remove("log");
}

async function loadGalleryData() {
  let data = await fetch(apiURL + "works");
  console.log(1, data);
  works = await data.json();
  let imgGalleryDiv = document.getElementById("img-gallery");
  console.log(2, works, imgGalleryDiv);

  works.forEach((work) => {
    const figureElem = document.createElement("figure");
    figureElem.classList.add("category" + work.categoryId);

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
  let filters = await data.json();
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

  let filtreObjets = document.querySelectorAll(".filterslist button");
  let imgGalleryDiv = document.getElementById("img-gallery");
  let figures = imgGalleryDiv.getElementsByTagName("figure");
  let buttonTous = document.getElementById("butontous");

  filtreObjets.forEach((btn) => {
    console.log(7, btn);
    btn.addEventListener("click", () => {
      console.log(8);
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

  loadModalGallery(works);
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
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

async function loadModalGallery(items) {
  const modalGalleryDiv = document.querySelector(".modal-gallery");
  modalGalleryDiv.innerHTML = "";

  items.forEach((item) => {
    const figureElem = document.createElement("figure");
    const imgElem = document.createElement("img");
    const trashIcon = document.createElement("i");

    imgElem.src = item.imageUrl;
    imgElem.alt = item.title;

    trashIcon.classList.add("fa-solid", "fa-trash-can", "trashicon");
    trashIcon.style.color = "#ffffff";
    trashIcon.style.position = "absolute";
    trashIcon.style.top = "5px"; // Adjust as needed
    trashIcon.style.right = "5px"; // Adjust as needed
    trashIcon.style.cursor = "pointer";
    // trashIcon.style.background = "#000";

    figureElem.style.position = "relative"; // Ensure the icon is positioned relative to the figure
    figureElem.appendChild(imgElem);
    figureElem.appendChild(trashIcon);

    modalGalleryDiv.appendChild(figureElem);
  });
}

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});
