// TODO: Enable following once login system has been implemented:
// let userId = FYSCloud.Session.get("userId");
//
// if(userId === undefined) {
//     window.location.href = "index.html";
// }

// Collapsible block elements:
const coll = document.querySelectorAll(".collapsible");
for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

// When clicking back button:
document.querySelector(".support-controls button#back").addEventListener("click", function() {
    window.location.href = "index.html";
});