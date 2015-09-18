var tweetWrapper = '#twitter-feed .social-wrapper .padder';

// Constructing wrappers and links for social icons sharing
var facebookShare1 = "<div class='social-icons'><a  class='facebook' href='https://www.facebook.com/sharer/sharer.php?u="
var facebookShare2 = "' onclick='window.open(this.href);return false;''></a></div>"
var twitterShare1 ="<div class='social-icons'><a class='twitter' href='https://twitter.com/share?url="
var twitterShare2 = "&via=lemonaiduk&hashtags=matingritual' onclick='window.open(this.href);return false;'></a></div>"

function animate(element) {
  new AnimOnScroll( document.getElementById(element), {
      minDuration : 0.4,
      maxDuration : 0.7,
      viewportFactor : 0.2
    } );
}

// ***************
// Instagram work
// ***************
var instBox = {
  share: function() {
    $('#instafeed a').each(function(i,e){
      var imgUrl = $(this).attr('href');
      $(this).parent('.padder').append(facebookShare1 + imgUrl + facebookShare2);
      $(this).parent('.padder').append(twitterShare1 + imgUrl + twitterShare2);
    })
  }
}

function runInstGrid() {
  // removes any extra instagrams over 3
  $('#instafeed .social-wrapper:gt(2)').remove()
  // builds share buttons
  instBox.share();
  // animates on scroll
  animate('instafeed');
}

// INSTAFEED for Instagram feed
var feed = new Instafeed({
  get: 'user',
  userId: 2138550272,
  accessToken: "2138550272.467ede5.1d1b99f4f2d34265ae1a35e7c217831e",
  filter: function(image) {
    return image.tags.indexOf('matingritual') >= 0;
  },
  clientId: 'e9d09c9963984fc09b96630679d00282',
  template: '<li class="social-wrapper"><div class="padder"><a class="insta-link" href="{{link}}" onclick="window.open(this.href);return false;"><img src="{{image}}" /></a></div></li>',
  limit: 20,
  resolution: 'standard_resolution',
  after: runInstGrid
});

// runs call for instagram feed
feed.run();

// ***************
// Twitter work
// ***************
var twitBox = {
  empties: function() {
    var keepThese = [];
    $('.padder .tweet a').each(function(h,j) {
      if ($(j).data('scribe') === "element:hashtag") {
        if ($(j).html() === "#matingritual" || $(j).html() === "#MatingRitual") {
          // if the tweet has a hashtag of matingritual it gets a keep class
          $(j).addClass('keep')
        }

        if ($(j).hasClass('keep')) {
          // if a social-wrapper has a child with the keep class, it gets a keeper class
          $(j).closest('.social-wrapper').addClass('keeper')
        }
      }
    })

    // remove all social-wrappers without a keeper class, and therefore all tweets without a #matingritual hashtag
    $('#twitter-feed .social-wrapper').each(function(i,e){
      if ($(e).hasClass('keeper') != true) {
        $(e).remove();
      } else {
        if ($($(e).find('.padder')).children().length > 2) {
          $(e).find('.user, .tweet').remove();
        } else {
          $(e).remove();
        }
      }

    })

    $('#twitter-feed .social-wrapper:gt(2)').remove();
        // force twitter images to be same height as width only above mobile
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) === false) {
          var twitterHeight = $($('.social-wrapper')[0]).find('.padder').width();
          if (twitterHeight > 100) {
            // in order to make mobile respect the js height it needs to be applied to multiple nested elements..
            $('#twitter-feed .social-wrapper, #twitter-feed .padder, #twitter-feed .media, #twitter-feed .media a img').height(twitterHeight);
          }
        }
  },
  placeholder: function(){
    if ($(tweetWrapper).length < 3) {
      // first get rid of any empty wrappers
      $('.social-wrapper').each(function(i,e) {
        if ($(e).children().length < 1) {
          $(e).remove();
        }
      })
      // then add in a placeholder box for each missing one
      $(".media-wrapper").append("<li class='social-wrapper'><div class='padder'><div class='media placer'><img src='img/mate1.jpg'></div></li>")
      if ($(tweetWrapper).length < 3) {
        $(".media-wrapper").append("<li class='social-wrapper'><div class='padder'><div class='media placer'><img src='img/mate2.jpg'></div></li>")
         if ($(tweetWrapper).length < 3) {
          $(".media-wrapper").append("<li class='social-wrapper'><div class='padder'><div class='media placer'><img src='img/mate3.jpg'></div></li>")
        }
      }
    }
  },
  share: function() {
    $('.media').each(function(i,e){
      if ($(e).hasClass('placer') != true) {
        var imgUrl = $(this).find('img').attr('src');
        var retweetUrl = $(this).find('.retweeter').attr('href');
        $(this).parent('.padder').append(facebookShare1 + imgUrl + facebookShare2);
        $(this).parent('.padder').append("<div class='social-icons'><a class='twitter' href='" + retweetUrl + "' onclick='window.open(this.href);return false;'></a></div>");
      }       
    })
    $('.retweeter').remove();
  }
}

// Initiates all Tweet calls
function handleTweets(tweets) {
    var x = tweets.length;
    var n = 0;
    var element = document.getElementById('twitter-feed')
    var html = '<div class="media-wrapper grid effect-2 cf" id="grid4">';
    while(n < x) {
      html += '<li class="social-wrapper">' + '<div class="padder">' + tweets[n] + '</div>' + '</li>';
      n++;
    }
    html += '</div>';   
    element.innerHTML = html;
    // removes any tweets without images
    twitBox.empties();
    // fill with placeholders if there are no more images from tweets
    twitBox.placeholder();
    // create the sharing icons after tweets have been constructed
    twitBox.share();
    // calls animateonScroll for new html elements loaded using js
    animate("grid4");
}

// Calling widget for #matingritual on twitter
var matingritual = {
  "id": '633279343653949441',
  "maxTweets": 20,
  "enableLinks": true,
  "showImages": true,
  "showUser": true,
  "showTime": false,
  "showTweet": false,
  "customCallback": handleTweets,
  "showInteraction": true,
  "showRetweet": true
};

// runs call for twitter widget
twitterFetcher.fetch(matingritual);


$(document).ready(function(){
   

  // loading screen
  $(window).on("load",function() {
    $(document).scrollTop(0);
    $("#loading").fadeOut(500);
    // only show share on hover
    $('.social-wrapper').hover(function(){
      $(this).find('.social-icons').slideDown();
      }, function(){
      $(this).find('.social-icons').slideUp();
    });

  })

  // To bring page to top on refresh even on safari
  if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    $(window).on('beforeunload', function(){
      $(window).scrollTop(0);
    });
  }

  // get rid of widows in text paragraphs
  $('p').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
  });

 
})  

