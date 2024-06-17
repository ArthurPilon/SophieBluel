const apiURL = "http://localhost:5678/api/";

async function loadGalleryData() {
  let data = await fetch(apiURL + "works");
  console.log(1, data);
  let works = await data.json();
  let imgGalleryDiv = document.getElementById("img-gallery");
  console.log(2, works, imgGalleryDiv);

  works.forEach((work) => {
    const figureElem = document.createElement("figure");

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
    buttonElem.setAttribute("data-id", "filtre" + filter.id);

    filtersDiv.appendChild(liElem);
    liElem.appendChild(buttonElem);
  });
}

window.onload = () => {
  loadFilters();
  loadGalleryData();
};
