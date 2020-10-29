
function myFunction() {
    //get modal element out of DOM
    var elem = document.querySelector(".modal");
    //add display flex style to modal class
    elem.style.display = 'flex';
    //wait for 2 seconds and redirect to home-not-logged-in.html
    setInterval(function(){
        window.location = "home-not-logged-in.html";
        },2000)
  }
function validateForm() {
    window.open("/homepage.html");
}