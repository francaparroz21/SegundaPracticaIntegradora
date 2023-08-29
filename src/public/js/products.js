const goToCartButton = document.querySelector("#goToCartButton")
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const btn_addToCart = document.querySelectorAll(".cartButton");

if(prevButton.getAttribute("href") === "") prevButton.style.visibility = "hidden";
if(nextButton.getAttribute("href") === "") nextButton.style.visibility = "hidden";
