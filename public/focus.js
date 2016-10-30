$(document).ready(function(){
  var questions = ["#one", "#two", "#three", "#four", "#five", "#six", "#seven", "#eight"];
  var k = 0;
  var activeK = 0;

  var middle = $(window).height()/2.0;
  var middlePoint = middle/2.0;

  $((questions[activeK]+"ans")).focus();

  for(k = 0; k<8; k++){
    //INIT
      var elOne = $ (questions[k]);
      var eTop = elOne.offset().top;
    //console.log((eTop - $(window).scrollTop() + " middle = " + middle));
    if((eTop - $(window).scrollTop())<(middle) && (eTop - $(window).scrollTop())>(middle-middlePoint)){
      activeK = k;
      $((questions[k]+"qs")).fadeTo(1, 1);
      if(k < 6){
      $((questions[k]+"but")).visible();
      $((questions[k]+"ans")).focus();
      $(questions[k]+"ent").visible();
      }
      else if(k == 6){
        $(".sevens").fadeTo(1, 1);
      }else{
        $(".eights").fadeTo(1, 1);
      }
    }else{

      $((questions[k]+"qs")).fadeTo(1, 0.4);
      if(k < 6){
      $((questions[k]+"but")).invisible();
      $((questions[k]+"ans")).blur();
      $(questions[k]+"ent").invisible();
    }else if(k == 6){
      $(".sevens").fadeTo(1, 0.4);
    }else{
      $(".eights").fadeTo(1, 0.4);
    }
    }
  }

  $(document).keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(questions[activeK]).offset().top
    }, 200);
    }
  });

    $(".myButton").click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(questions[activeK]).offset().top
    }, 200);

    });

    $(".submit").click(function(e){
      e.preventDefault();

      $.ajax({
        type: "POST",
        url: "/api/",
        data: JSON.stringify({
          "size":"large",
          "languages":["java", "python", "c++", "perl"],
          "roles":["SE"],
          "platforms":["mobile"],
          "locations":["san francisco, palo alto, seattle"],
          "fields":["software", "hardware"]
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function(result) {
          console.log("Success!");
          console.log(result.companies);
          window.location = result.redirect
        }
      });
    });
      /*
        $.ajax
            url: '/api/'
            type: 'POST'
            data: $({test:"test"}}).serialize()
            dataType: 'json'
            success: (data, textStatus, jqXHR) ->
                if typeof data.redirect == 'string'
                    window.location = data.redirect*/

/*
    $(".submit").click(function(e){
      e.preventDefault();
      $.ajax
            url: '/api/'
            type: 'POST'
            data: $({
  "size":"large",
  "languages":["java", "python", "c++", "perl"],
  "roles":["SE"],
  "platforms":["mobile"],
  "locations":["san francisco, palo alto, seattle"]
}).serialize()
dataType: 'json'
  success: (data, textStatus, jqXHR) ->
      if typeof data.redirect == 'string'
          window.location = data.redirect
    });*/

    $(".choiceButton").click(function(e){
      e.preventDefault();
      $(e.target).toggleClass("des sel");
    });


  $(window).scroll(function () {
    console.log(activeK);
    for(k = 0; k<8; k++){
      var elOne = $ (questions[k]);
      var eTop = elOne.offset().top;
    //console.log((eTop - $(window).scrollTop() + " middle = " + middle));
    if((eTop - $(window).scrollTop())<(middle) && (eTop - $(window).scrollTop())>(middle-middlePoint)){
      activeK = k;


      $((questions[k]+"qs")).fadeTo(1, 1);
      if(k < 6){
      $(questions[k]+"but").visible();
      $((questions[k]+"ans")).focus();
      $((questions[k]+"ans")).unfade();
      $(questions[k]+"ent").visible();
    }else if(k == 6){
      $(".sevens").fadeTo(1, 1);
    }else{
      $(".eights").fadeTo(1, 1);
    }
    }else{

      $((questions[k]+"qs")).fadeTo(1, 0.4);
      if(k < 6){
      $(questions[k]+"but").invisible();
      $((questions[k]+"ans")).blur();
      $((questions[k]+"ans")).fade();
      $(questions[k]+"ent").invisible();
    }else if(k == 6){
      $(".sevens").fadeTo(1, 0.4);
    }else{
      $(".eights").fadeTo(1, 0.4);
    }
    }
  }
  });
});

(function($) {
  $.fn.invisible = function() {
      return this.each(function() {
          $(this).css("visibility", "hidden");
      });
  };
  $.fn.visible = function() {
      return this.each(function() {
          $(this).css("visibility", "visible");
      });
  };
}(jQuery));


(function($) {
  $.fn.fade = function() {
      return this.each(function() {
          $(this).css("opacity", "0.3");
      });
  };
  $.fn.unfade = function() {
      return this.each(function() {
          $(this).css("opacity", "1");
      });
  };
}(jQuery));
