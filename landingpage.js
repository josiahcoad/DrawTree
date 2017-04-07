function pass() {
	swal({
	  title: "dreamMkr",
	  text: "This is an early release,<br>please enter a password to gain access:",
	  type: "input",
	  showCancelButton: true,
	  confirmButtonColor: "#73b26c",
	  closeOnConfirm: false,
	  inputPlaceholder: "",
	  html: true
	},
	function(inputValue){
	if (inputValue === false) return false;

	if (inputValue != "dreamBig") {
		swal.showInputError("Access Denied - Please Try Again.");
		return false
	}

	swal({
		title: "Access Granted",
		text: "Welcome to dreamMkr",
		type: "success",
		confirmButtonText: "Enter",
		confirmButtonColor: "#73b26c",
		html: true
	},
		function(){
			window.open('main.html', "_self");
		});
	});
}



$(document).ready(function(){
        $("#logo").animate({left: '0px'}, 1800);
        $("#title").animate({top: '0px'}, 1000);
});