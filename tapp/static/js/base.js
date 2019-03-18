
// Open sidebar
function openSidebar() {
  document.getElementById("main").style.marginLeft = '320px'
  document.getElementById("mySidebar").style.width = '320px'
  document.getElementById("mySidebar").style.display = 'block'
  document.getElementById("myOverlay").style.display = 'block'
}

// Close sidebar
function closeSidebar() {
  document.getElementById("main").style.marginLeft = '0%'
  document.getElementById("mySidebar").style.display = 'none'
  document.getElementById("openNav").innerHTML = '<i class=\"fa fa-bars\">'
  document.getElementById("myOverlay").style.display = 'none'
}

function showElement(id) {
    document.getElementById(id).style.display = 'block'
}

function hideElement(id) {
    document.getElementById(id).style.display = 'none'
}

function toggleElement(id) {

    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function setPageTitle(title) {
    document.getElementById('page-title').innerHTML = title
}