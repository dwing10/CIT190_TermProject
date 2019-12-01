function openNav() {
  $("#mySidenav").css("width", "250px");
  $("#main").css("marginLeft", "250px");
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
  $("#mySidenav").css("width", "0");
  $("#main").css("marginLeft", "0");
  document.body.style.backgroundColor = "black";
}