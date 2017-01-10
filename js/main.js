$(document).ready(function() {

  ////////
  //добавляем задержку обработки тапов по карточке, чтобы избежать нажатия
  //кнопки до того, как она появилась визуально
  ////////

  //объявляем глобальную переменную, в которой будет хранится прошлый
  //обработанный элемент для того, чтобы вернуть ему изначальное состояние
  //по тапу на другой элемент
  var previousTaped;

  $(".page-cards__card-image").on("tap", function(event) {

    if (typeof previousTaped !== "undefined") {
      previousTaped.parent().next().css("pointer-events", "none");
    };
    previousTaped = $(this);

    var cardInfo = $(this).parent().next();
    cardInfo.css("pointer-events", "none");

    setTimeout(function() {
        cardInfo.css("pointer-events", "all");
        console.log("click!");
    }, 300);

  });

  ////////
  //инициализируем метод плагина scrollSpeed для ускоренного скролла на десктопе
  ////////

  jQuery.scrollSpeed(100, 200);

});
