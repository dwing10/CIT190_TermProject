function openNav() {
  $("#mySidenav").css("width", "250px");
  $("#main").css("marginLeft", "250px");
  $(this).css("background-color", "rgba(0,0,0,0.4)");  //document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
  $("#mySidenav").css("width", "0");
  $("#main").css("marginLeft", "0");
  $(this).css("background-color", "black");  //document.body.style.backgroundColor = "black";
}