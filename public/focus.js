$(document).ready(function(){
  var questions = ["#one", "#two", "#three", "#four", "#five", "#six", "#seven", "#eight", "#nine"];
  var k = 0;
  var activeK = 0;

  var fields = [];
  var roles = [];
  var platforms = [];

  var middle = $(window).height()/2.0;
  var middlePoint = middle/2.0;

  $((questions[activeK]+"ans")).focus();

  for(k = 0; k<9; k++){
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
      }else if(k == 7){
        $(".eights").fadeTo(1, 1);
      }
      else{
        $(".nines").fadeTo(1, 1);
      }
    }else{

      $((questions[k]+"qs")).fadeTo(1, 0.4);
      if(k < 6){
      $((questions[k]+"but")).invisible();
      $((questions[k]+"ans")).blur();
      $(questions[k]+"ent").invisible();
    }else if(k == 6){
        $(".sevens").fadeTo(1, 0.4);
      }else if(k == 7){
        $(".eights").fadeTo(1, 0.4);
      }
      else{
        $(".nines").fadeTo(1, 0.4);
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
      var name = $("#oneans").val();
      var grad = $("#threeans").val();
      var languages = $("#sixans").val().split(/,\s+/);
      var locations = $("#fiveans").val().split(/,\s+/);

      $.ajax({
        type: "POST",
        url: "/api/",
        data: JSON.stringify({
          "size":"",
          "languages":languages,
          "roles":roles,
          "platforms":platforms,
          "locations":locations,
          "fields":fields
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



    $(".eights").click(function(e){
      e.preventDefault();
      $(e.target).toggleClass("des sel");
      var i = fields.indexOf($(e.target).text());
      if(i > -1){
        fields.splice(i, 1);
      }else{

      fields.push($(e.target).text());
    }
    });

    $(".sevens").click(function(e){
      e.preventDefault();
      $(e.target).toggleClass("des sel");
      var sf = "";
      switch($(e.target).text()){
        case "Software Engineer":
         sf = "SE";
        break;
        case "Designer":
         sf = "UI";
        break;
        case "Product Manager":
        sf = "PM";
        break;
      }
    var i = roles.indexOf(sf);
      if(i > -1){
        roles.splice(i, 1);
      }else{
        var sf = "";
        switch($(e.target).text()){
          case "Software Engineer":
           sf = "SE";
          break;
          case "Designer":
           sf = "UI";
          break;
          case "Product Manager":
          sf = "PM";
          break;
        }
      roles.push(sf);
    }
    });

    $(".nines").click(function(e){
      e.preventDefault();
      $(e.target).toggleClass("des sel");
      var i = platforms.indexOf($(e.target).text());
      if(i > -1){
        platforms.splice(i, 1);
      }else{
      platforms.push($(e.target).text());
    }
    console.log(platforms);
    });


  $(window).scroll(function () {
    for(k = 0; k<9; k++){
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
      }else if(k == 7){
        $(".eights").fadeTo(1, 1);
      }
      else{
        $(".nines").fadeTo(1, 1);
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
      }else if(k == 7){
        $(".eights").fadeTo(1, 0.4);
      }
      else{
        $(".nines").fadeTo(1, 0.4);
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
