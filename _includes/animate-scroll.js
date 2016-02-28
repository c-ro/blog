$(window).scroll(function() {
  if ($(this).scrollTop() > 300) {
    $('.head').stop().animate({"left":"110%"}, "slow");
  } else if ($(this).scrollTop() < 300) {
    $('.head').stop().animate({"left":"80%"}, "slow");
  }
});