$(document).ready(function() {

  allowSubmit = false;
  console.log("allowSubmit: " + allowSubmit);

  $("form").submit(function(e){
    if(allowSubmit) return true;

    console.log("fill in the captcha!");
    e.preventDefault(e);
  });

});

////////
//добавляем callback-функции для обработки состояний recaptcha
////////
function capchaExpired () {
    allowSubmit = false;
    console.log("Capcha expired! Sad..");
    console.log("allowSubmit: " + allowSubmit);
}

function capchaFilled () {
    allowSubmit = true;
    console.log("Capcha filled! Nice!");
    console.log("allowSubmit: " + allowSubmit);
}
