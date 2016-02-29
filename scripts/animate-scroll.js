// debouncing version of the following:
// http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function($, sr){
  
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;

            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 20);
        };
    };

    // smartscroll
    jQuery.fn[sr] = function(fn, threshhold){  return fn ? this.bind('scroll', debounce(fn, threshhold)) : this.trigger(sr); };

})(jQuery,'smartscroll');

// Carl's animation:
$(window).smartscroll(function(){
  if ($(this).scrollTop() > 100) {
    $('.head').stop().animate({"left":"110%"}, "slow");
  } else if ($(this).scrollTop() < 100) {
    $('.head').stop().animate({"left":"80%"}, "slow");
  }
});