$(document).ready(function() {

  //добавляем задержку обработки тапов по карточке, чтобы избежать нажатия
  //кнопки до того, как она появилась визуально
  $(".page-cards__card-image").on("tap", function(event) {

    var cardInfo = $(this).parent().next();
    cardInfo.css("pointer-events", "none");

    setTimeout(function() {
        cardInfo.css("pointer-events", "all");
    }, 300);
  });

  //инициализируем метод плагина scrollSpeed для ускоренного скролла на десктопе
  jQuery.scrollSpeed(200, 800);

});
