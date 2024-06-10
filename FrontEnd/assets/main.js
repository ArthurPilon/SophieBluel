const apiURL = "http://localhost:5678/api/";

async function loadGalleryData() {
  let data = await fetch(apiURL + "works");

  let works = await data.json();
  let imgGalleryDiv = document.getElementById("img-gallery");

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
