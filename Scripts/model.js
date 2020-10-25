function myFunction() {
    //get modal element out of DOM
    var elem = document.querySelector(".modal");
    //add display flex style to modal class
    elem.style.display = 'flex';
    //wait for 2 seconds and redirect to index.html
    setInterval(function(){
        window.location = "index.html";
        },2000)
  }