(function( $ ){
  $.fn.tgAuth = function(options) {
    var settings = $.extend( {'signUpFrm' : '#tgSignUpFrm' }, options);

    var API_URL = "https://api.bots.business"
    var TG_AUTH_URL = API_URL + "/external_autorizations";
    var EUA_CREATE_URL = TG_AUTH_URL;

    if(settings.botId){
      EUA_CREATE_URL = API_URL + '/bots/' + String(settings.botId);
    }

    auth_state = {
      checkTgAuthState: function(token){
        jQuery.get( TG_AUTH_URL + '/' + token, function(res) {
          if(res.user){
            jQuery("#tgauthContainer").hide();
            settings.onAuthorize(res.user);
          }else{
            checkAgain(token);
          }
        })
        .fail(function() {
          checkAgain(token);
        })
      }
    }

    function checkAgain(token){
      setTimeout(function() { auth_state.checkTgAuthState(token) }, 1000);
    }

    jQuery(settings.signUpFrm).on("submit", function(){
      // get TG deep link
      jQuery.post( EUA_CREATE_URL, settings.bot_params, function(eua) {
        var url = TG_AUTH_URL + '/go/' + eua.token;
        var win = window.open(url, '_blank');
        win.focus();

        jQuery('#tgSignUpFrm').hide();
        jQuery('#tgAuthLink').attr('href', url);
        jQuery("#tgWait").show();
        auth_state.checkTgAuthState(eua.token);
      })
      .fail(function() {
        alert("Something wrong. Please try again later");
      })

      return false;
    })

  };

})( jQuery );