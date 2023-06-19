const goToCartButton = document.querySelector("#goToCartButton")
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const btn_addToCart = document.querySelectorAll(".cartButton");

if(prevButton.getAttribute("href") === "") prevButton.style.visibility = "hidden";
if(nextButton.getAttribute("href") === "") nextButton.style.visibility = "hidden";

/* btn_addToCart.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const eventId = btn.getAttribute("id");
        addToCart(eventId)
    })
})

const addToCart = async (pid) => {
    try {
        await fetch(`/api/carts/${cartId}/product/${pid}`, {method: "post"});
    } catch (error) {
        console.log(error);
    }
}    */