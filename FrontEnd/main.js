const apiURL = "http://localhost:5678/api/";

async function loadGalleryData() {
  let data = await fetch(apiURL + "works");
  console.log(1, data);
  const works = await data.json();
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
};
