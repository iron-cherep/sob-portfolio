$(document).ready(function() {

  allowSubmit = false;

  $("form").submit(function(e){
    if (allowSubmit) {
      $(".form__spinner-wrapper").removeClass("form__spinner-wrapper--hidden");

      return true;
    }

    var animationEnd = "webkitAnimationEnd oanimationend msAnimationEnd animationend";
    var recaptcha = $(".form__recaptcha");

    recaptcha.addClass("shake");
    recaptcha.one(animationEnd, function(e) {
      recaptcha.removeClass("shake");
    });

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
