'use strict';

window.onload = function () {

  var page_class = this.document.querySelector(".container");

  // function for removing preloader ( THE TOP MOST COMMON FUNCTION )
  function removeLoader() {
    setTimeout(function () {
      document.querySelector(".loader").classList.add("none");
      document.querySelector("html").classList.remove("no-scroll");
    }, 3000);
  }

  if (page_class.classList.contains("login-page")) {
    console.log("hii");

    // for dom manupulation of the page
    var formButton = Array.from(this.document.querySelectorAll(".get-started a"));
    var videoLi = Array.from(this.document.querySelectorAll(".banner li"));
    var closeModal = document.querySelector(".close");
    var signupFieldsArray = this.Array.from(this.document.querySelectorAll(".sign-up-form input"));
    var signinFieldsArray = this.Array.from(this.document.querySelectorAll(".sign-in-form input"));
    var submitForm = this.Array.from(this.document.querySelectorAll(".form-controls a"));
    var switchForms = this.Array.from(this.document.querySelectorAll(".pannel-container a"));

    var RegexExpression = {
      username_regex: /^([a-zA-Z]){2,10}$/,
      email_regex: /^([0-9a-zA-Z\_\.\-]+)@([0-9a-zA-Z\_\.\-]+)\.([a-zA-Z]+)$/,
      password_regex: /((?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-zA-Z])){4,15}/
    }

    // function for displaying the form modal
    formButton.forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelector(".modal").classList.add("block");

        var formModal = document.querySelector(".form-modal");
        formModal.classList.add("block");

        if (element.classList.contains("sign-in-button")) {
          formModal.classList.add("active");
        }
      });
    });

    // function for switching the forms
    switchForms.forEach(function (element) {
      element.addEventListener("click", function () {
        var formModal = document.querySelector(".form-modal");
        if (element.id === "sign-in-form") {
          formModal.classList.add("active");
        } else { formModal.classList.remove("active"); }
      })
    });

    // function for displaying the video modal
    videoLi.forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelector(".modal").classList.add("block");

        var videoModal = document.querySelector(".video-modal");
        videoModal.classList.add("block");

        var videoSource = element.getAttribute("data-video-source");

        videoModal.firstElementChild.setAttribute("src", videoSource);
      })
    });

    // function for closing the modal
    closeModal.addEventListener("click", function () {
      var activeModal = document.querySelector(".modal .block");

      if (activeModal.classList.contains("form-modal")) {
        document.querySelector(".form-modal").classList.remove("block");
        document.querySelector(".form-modal").classList.remove("active");

        formReset();
      }
      else if (activeModal.classList.contains("video-modal")) {
        document.querySelector(".video-modal").classList.remove("block");
        document.querySelector("video").pause();
        document.querySelector("video").currentTime = 0;
      }

      document.querySelector(".modal").classList.remove("block");
    })

    // function for sign up form validation
    signupFieldsArray.forEach(function (element) {
      var inputRegex = element.getAttribute("data-regex");
      for (var key in RegexExpression) {

        if (inputRegex === key) {

          var regexForThis = RegexExpression[key];

          element.addEventListener("keyup", function () {
            validate(regexForThis, this);
          })
        }
      }
    });

    // function for form validate the regex
    function validate(RegularExpression, input) {
      var parent = input.parentNode;
      if (input.value == "") {
        parent.classList = "form-group";
      }
      else if (RegularExpression.test(input.value)) {
        parent.classList = "form-group success"
      } else {
        parent.classList = "form-group error"
      }
    }

    // function for sign in form validation
    signinFieldsArray.forEach(function (element) {
      element.addEventListener("keyup", function () {
        element.parentElement.classList = "form-group";
      })
    });


    // function for form submission
    submitForm.forEach(function (element) {

      if (element.classList.contains("sign-up")) {
        element.addEventListener("click", storeData);
      }

      if (element.classList.contains("sign-in")) {
        element.addEventListener("click", verifyUser);
      }
    });

    // function for storing data
    function storeData(e) {
      e.preventDefault();

      var allFeildsRight = null;
      var newEmail = document.querySelector(".sign-up-email");

      // checking the all feilds are right or wrong
      for (var i = 0; i < signupFieldsArray.length; i++) {
        var parent = signupFieldsArray[i].parentNode;
        if (parent.classList.contains("error") || parent.classList == "form-group") {
          allFeildsRight = false;
          signupFieldsArray.forEach(function (element) {
            if (element.value === "") {
              element.parentNode.classList.add("error");
            }
          });
          break;
        } else if (parent.classList.contains("success")) { allFeildsRight = true; }
      }

      // checking the email-id already registered or not
      var UserAlreadyExist = checkUser(newEmail);

      // function if both the condition are satisfying
      if (allFeildsRight && !UserAlreadyExist) {

        var username = document.querySelector(".sign-up-name");
        var email = document.querySelector(".sign-up-email");
        var password = document.querySelector(".sign-up-password");
        alert("FORM SUCCESSFULLY SUBMITED");

        var unicode = "tmdbuser" + window.localStorage.length;

        var data = {
          name: username.value,
          mail: email.value,
          pass: password.value,
          unicode: unicode
        }

        var data_serialized = JSON.stringify(data);

        window.localStorage.setItem(unicode, data_serialized);

        formReset();
        window.location.assign("movies.html?userid=" + unicode + "&category=movie");
      } else { newEmail.parentElement.classList = "form-group error" }
    }

    // function for checking the user-is exist or not
    function checkUser(Email) {
      if (localStorage.length !== 0) {
        for (var key in localStorage) {
          if (key === "length") { break; }
          else if (key.includes("tmdbuser")) {
            var parseData = JSON.parse(localStorage[key]);

            if (Email.value === parseData.mail) {
              return parseData;
            }
          }
        } return false;
      } else { return false; }
    }

    // function for verifying the user
    function verifyUser() {
      var signInEmail = document.querySelector(".sign-in-email");

      var UserAlreadyExist = checkUser(signInEmail);
      if (UserAlreadyExist) {
        var signInPassword = document.querySelector(".sign-in-password");
        var password = UserAlreadyExist.pass;
        if (signInPassword.value === password) {
          formReset();
          var unicode = UserAlreadyExist.unicode;
          window.location.assign("movies.html?userid=" + unicode + "&category=movie");
        } else { signInPassword.parentElement.classList.add("error") }
      } else { signInEmail.parentElement.classList.add("error") }
    }

    // function for resetting the form
    function formReset() {
      var forms = Array.from(document.querySelectorAll("form"));

      forms.forEach(function (element) {
        element.reset();

        var formGroups = Array.from(element.querySelectorAll(".form-group"));
        formGroups.forEach(function (element) {
          element.classList = "form-group";
        });
      });
    }

    // for removing preloader
    removeLoader();
    
  } else {

    // some confidential information
    var base_url = "https://api.themoviedb.org/3/";
    var key = "b4803476184cb34c231d8f2f07da0bc7";
    var contractual_url = "&language=en-US&page=1";
    var trending_config = "trending";
    var top_rated_config = "top_rated";
    var most_popular_config = "popular";
    var now_playing_config = "now_playing";
    var upcoming_config = "upcoming";
    var airing_today_config = "airing_today";
    var on_air_config = "on_the_air";
    var currentUrl = new URL(window.location.href);
    var loggedInUser = currentUrl.searchParams.get("userid");

    // javascript for rest of the pages except login page 
    var hamburger = this.document.querySelector(".hamburger");
    var searchFeild = this.document.querySelector(".input-text");

    // function for activating the nav bar
    hamburger.addEventListener("click", function () {
      document.querySelector("nav").classList.toggle("active");
      hamburger.classList.toggle("active-hamburger");
      document.querySelector("html").classList.toggle("no-scroll");
    })

    // function for activating search bar when inner width is less than 1024px
    searchFeild.nextElementSibling.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.innerWidth <= 1024) {
        searchFeild.parentElement.parentElement.classList.add("active-search");
        searchFeild.focus();
      }
    })

    // function for deactivating search bar when it is out of focus
    searchFeild.addEventListener("blur", function () {
      if (searchFeild.value === "") {
        searchFeild.parentElement.parentElement.classList.remove("active-search");
      }
    })

    // function for passing values through url
    document.querySelector(".movies-page").setAttribute("href", "movies.html?userid=" + loggedInUser + "&category=movie");
    document.querySelector(".tvshows-page").setAttribute("href", "tvshows.html?userid=" + loggedInUser + "&category=tv");

    /*=================================
      movies page scripting starts here
    =================================*/
    if (page_class.classList.contains("movies")) {

      var category = currentUrl.searchParams.get("category");

      window.addEventListener("scroll", scrollAnimate);

      function scrollAnimate() {
        var pageAt = (window.scrollY + window.innerHeight);

        var counter = document.querySelector(".counters");
        var counterAt = (counter.offsetTop + counter.offsetHeight * 0.75);

        if (pageAt > counterAt) { runCounter(counter); }
      }

      // function for search the movies
      searchFeild.addEventListener("keyup", function () {
        var searched_query = searchFeild.value;
        var url = base_url + "search/" + category + "?api_key=" + key + "&language=en-US&query=" + searched_query + "&page=1&include_adult=false";
        search(url, searched_query, "title");
      });

      // function for banner displaying
      var banner_url = base_url + trending_config + "/" + category + "/day?api_key=" + key;
      bannerDevelopment(banner_url, "title", "release_date");

      // function for top rated movies
      var top_rated_movies_url = base_url + category + "/" + top_rated_config + "?api_key=" + key + contractual_url;
      var top_rated_slider_place = document.querySelector(".top-rated-slider");
      sliderDevelopment(top_rated_movies_url, top_rated_slider_place, "title", "release_date", top_rated_config);

      // function for most popular movies
      var most_popular_movies_url = base_url + category + "/" + most_popular_config + "?api_key=" + key + contractual_url;
      var most_popular_slider_place = document.querySelector(".most-popular-slider");
      sliderDevelopment(most_popular_movies_url, most_popular_slider_place, "title", "release_date", most_popular_config);


      // function for now playing movies
      var now_playing_movies_url = base_url + category + "/" + now_playing_config + "?api_key=" + key + contractual_url;
      var now_playing_gallery_place = document.querySelector(".now-playing-movies ul");
      galleryDevelopment(now_playing_movies_url, now_playing_gallery_place, "title", now_playing_config);


      // function for upcoming movies
      var upcoming_movies_url = base_url + category + "/" + upcoming_config + "?api_key=" + key + contractual_url;
      var upcoming_gallery_place = document.querySelector(".upcoming-movies ul");
      galleryDevelopment(upcoming_movies_url, upcoming_gallery_place, "title", upcoming_config, true);

    }
    /*=================================
      tvshows page scripting starts here
    =================================*/
    else if (page_class.classList.contains("tvshows")) {

      var category = currentUrl.searchParams.get("category");

      // function for search the tvshows
      searchFeild.addEventListener("keyup", function () {
        var searched_query = searchFeild.value;
        var url = base_url + "search/" + category + "?api_key=" + key + "&language=en-US&query=" + searched_query + "&page=1&include_adult=false";
        search(url, searched_query, "name");
      });

      // function for banner displaying
      var banner_url = base_url + trending_config + "/" + category + "/day?api_key=" + key;
      bannerDevelopment(banner_url, "name", "first_air_date");

      // function for top rated tvshows
      var top_rated_tvshows_url = base_url + category + "/" + top_rated_config + "?api_key=" + key + contractual_url;
      var top_rated_slider_place = document.querySelector(".top-rated-slider");
      sliderDevelopment(top_rated_tvshows_url, top_rated_slider_place, "name", "first_air_date", top_rated_config);

      // function for on air tvshows
      var on_air_tvshows_url = base_url + category + "/" + on_air_config + "?api_key=" + key + contractual_url;
      var on_air_slider_place = document.querySelector(".on-air-slider");
      sliderDevelopment(on_air_tvshows_url, on_air_slider_place, "name", "first_air_date", on_air_config);


      // function for airing today tvshows
      var airing_today_tvshows_url = base_url + category + "/" + airing_today_config + "?api_key=" + key + contractual_url;
      var airing_today_gallery_place = document.querySelector(".airing-today-tvshows ul");
      galleryDevelopment(airing_today_tvshows_url, airing_today_gallery_place, "name", airing_today_config);


      // function for trending tvshows
      var trending_tvshows_url = base_url + category + "/" + most_popular_config + "?api_key=" + key + contractual_url;
      var trending_tvshows_gallery_place = document.querySelector(".trending-news ul");
      galleryDevelopment(trending_tvshows_url, trending_tvshows_gallery_place, "name", most_popular_config, true);

    }

    else if (page_class.classList.contains("pagination")) {

      var category = currentUrl.searchParams.get("category");
      var config_data = currentUrl.searchParams.get("config");
      var title, date;

      if (category === "movie") {
        title = "title";
        date = "release_date";
      }
      else if (category === "tv") {
        title = "name";
        date = "first_air_date";
      }


      // function for search the tvshows
      searchFeild.addEventListener("keyup", function () {
        var searched_query = searchFeild.value;
        var url = "https://api.themoviedb.org/3/search/" + category + "?api_key=" + key + "&language=en-US&query=" + searched_query + "&page=1&include_adult=false";
        search(url, searched_query, title);
      });


      var heading = document.querySelector("h3");
      heading.innerText = config_data.replace("_", " ") + " " + category + " shows";

      // function for pagination list development
      var generated_url = base_url + category + "/" + config_data + "?api_key=" + key + contractual_url;
      var pagination_list_place = this.document.querySelector(".pagination-list");
      paginationListDevelopment(generated_url, pagination_list_place, title, date);

      var pagination_bar_array = Array.from(this.document.querySelectorAll(".pagination-bar li"));
      pagination_bar_array.forEach(function (element) {
        element.addEventListener("click", function () {

          // document.querySelector(".loader").classList.remove("none");
          var previous_active = document.querySelector(".pagination-bar .active-page");
          previous_active.classList.remove("active-page");
          element.classList.add("active-page");

          var updated_contractual_url = contractual_url.slice(0, -1) + element.innerText;
          var generated_paginated_url = base_url + category + "/" + config_data + "?api_key=" + key + updated_contractual_url;
          paginationListDevelopment(generated_paginated_url, pagination_list_place, title, date);
        })
      });
    }
    /*=================================
      details page scripting starts here
    =================================*/
    else if (page_class.classList.contains("details")) {

      var userid = currentUrl.searchParams.get("userid");
      var category = currentUrl.searchParams.get("category");
      var tmdbId = currentUrl.searchParams.get("uniqueid");
      var title, tagline;

      var userData = JSON.parse(window.localStorage[userid]);
      console.log(userData);
      
      var ratings = this.Array.from(this.document.querySelectorAll(".rating"));

      if(userData.ratedShows){
        for (var unikey in userData.ratedShows) {
          if(tmdbId == unikey.split("ID")[1]){
            ratings.forEach(function(element) {
              if(ratings.indexOf(element) < parseInt(userData.ratedShows[unikey].split(" ")[0])){
                element.classList.add("rated-star");
              } else{
                element.classList.add("non-rated-star");
              }
            });
          }
        }
      }

      if(userData.favouriteShows){
        userData.favouriteShows.forEach(function(element) {
          if(tmdbId == element.split("ID")[1]){
            document.querySelector(".favourite").classList.add("added-to-favourite");
          }
        });
      }

      if (category === "movie") {
        title = "title";
        tagline = "tagline";
      }
      else if (category === "tv") {
        title = "name";
        tagline = "first_air_date";
      }

      window.addEventListener("click", function (e) {
        if (!e.target.classList.contains("ratings")) {
          ratings.forEach(function (element) {
            element.classList.remove("show");
          });
        }
      })

      window.addEventListener("resize", function () {
        checkWindowSize();
      })

      function checkWindowSize() {
        if (window.innerWidth <= 1024) {
          document.querySelector(".ratings").addEventListener("click", function () {
            ratings.forEach(function (element) {
              element.classList.add("show");
            });
          })
        }
      }

      checkWindowSize();

      ratings.forEach(function (element) {
        element.addEventListener("click", function () {
          var index = ratings.indexOf(element);
          rateThis(index);
        })
      });

      function rateThis(rating) {

        ratings.forEach(function (element) {
          var position = ratings.indexOf(element);
          if (position <= rating) {
            element.classList.add("rated-star");
          } else {
            element.classList.remove("rated-star");
            element.classList.add("non-rated-star");
          }
        });

        if (!userData.ratedShows) {
          var ratedShows = { [category + "ID" + tmdbId]: rating + 1 + " STAR" }
          userData["ratedShows"] = ratedShows;
          window.localStorage.setItem(userid, JSON.stringify(userData));
        } else {
          var uniKey = category + "ID" + tmdbId;
          for (var uniqueid in userData.ratedShows) {
            if (uniqueid == uniKey) {
              userData.ratedShows[uniqueid] = rating + 1 + " STAR";
              window.localStorage.setItem(userid, JSON.stringify(userData));
              return false;
            }
          }
          userData.ratedShows[uniKey] = rating + 1 + " STAR";
          window.localStorage.setItem(userid, JSON.stringify(userData));
        }
      }

      // function for add to favourites
      document.querySelector(".favourite").addEventListener("click", function () {

        this.classList.add("added-to-favourite");

        if (!userData.favouriteShows) {
          var favouriteShows = [category + "ID" + tmdbId];
          userData["favouriteShows"] = favouriteShows;
          window.localStorage.setItem(userid, JSON.stringify(userData));
        } else {

          var addToFavourite = true;
          userData.favouriteShows.forEach(function (element) {
            if (element == category + "ID" + tmdbId) {
              userData.favouriteShows.splice(userData.favouriteShows.indexOf(element), 1);
              document.querySelector(".favourite").classList.remove("added-to-favourite");
              window.localStorage.setItem(userid, JSON.stringify(userData));
              addToFavourite = false;
            }
          });

          if (addToFavourite) {
            userData.favouriteShows.push(category + "ID" + tmdbId);
            window.localStorage.setItem(userid, JSON.stringify(userData));
          }
        }
      })


      // function for search
      searchFeild.addEventListener("keyup", function () {
        var searched_query = searchFeild.value;
        var url = "https://api.themoviedb.org/3/search/" + category + "?api_key=" + key + "&language=en-US&query=" + searched_query + "&page=1&include_adult=false";
        search(url, searched_query, title, category);
      });

      var MovieDetailUrl = "https://api.themoviedb.org/3/" + category + "/" + tmdbId + "?api_key=" + key + "&language=en-US";
      detailBannerDevelopment(MovieDetailUrl, title, tagline, category);

      var getCreditsUrl = "https://api.themoviedb.org/3/" + category + "/" + tmdbId + "/credits?api_key=" + key;
      castingSectionDevelopment(getCreditsUrl);

      var getReviewsUrl = "https://api.themoviedb.org/3/" + category + "/" + tmdbId + "/reviews?api_key=" + key + "&language=en-US&page=1";
      reviewSectionDevelopment(getReviewsUrl);

      var relatedUrl = "https://api.themoviedb.org/3/" + category + "/" + tmdbId + "/similar?api_key=" + key + "&language=en-US&page=1";
      relatedGalleryDevelopment(relatedUrl, title, true);


      /*================================================
        common functions for building the detail page
      =================================================*/

      // function for detail banner development
      function detailBannerDevelopment(url, title, tagline, type) {
        getData(url, callback);

        function callback(Data) {
          document.querySelector(".name").innerText = Data[title];
          document.querySelector(".tagline").innerText = Data[tagline];
          document.querySelector(".overview").innerText = Data.overview;

          var appendHere = document.querySelector(".indetail");

          if (type === "movie") {
            createNode("span", appendHere, "release date <br><br> " + Data.release_date);
            createNode("span", appendHere, "revenue <br><br> $ " + Data.revenue);
            createNode("span", appendHere, "budget <br><br> $ " + Data.budget);
            createNode("span", appendHere, "runtime <br><br> " + Data.runtime + " minutes");
            createNode("span", appendHere, "vote average <br><br> " + Data.vote_average);
          }
          else if (type === "tv") {
            createNode("span", appendHere, "first air date <br><br> " + Data.first_air_date);
            createNode("span", appendHere, "no of seasons <br><br> " + Data.number_of_seasons);
            createNode("span", appendHere, "no of episodes <br><br> " + Data.number_of_episodes);
            createNode("span", appendHere, "episode runtime <br><br> " + Data.episode_run_time[0] + "minutes");
            createNode("span", appendHere, "vote average <br><br> " + Data.vote_average);
          }

          var src = null;
          if (window.innerWidth <= 767) {
            var src = "https://image.tmdb.org/t/p/w92" + Data.poster_path;
          } else {
            var src = "https://image.tmdb.org/t/p/w780" + Data.backdrop_path;
          }

          document.querySelector(".detail-banner").setAttribute("style", "background-image:url(" + src + ")");
        }
      }


      // function for cast people section
      function castingSectionDevelopment(url) {
        var appendHere = document.querySelector(".cast ul");
        getData(url, callback);

        function callback(Data) {
          Data.cast.forEach(function (element) {
            if (element.profile_path !== null && appendHere.querySelectorAll("li").length < 5) {
              var LiNode = createNode("li", appendHere, "");
              var FigureNode = createNode("figure", LiNode, "");
              var ImageNode = createNode("img", FigureNode, "");
              var SpanNode = createNode("span", LiNode, element.name);
              var SpanNode = createNode("span", LiNode, "as");
              var SpanNode = createNode("span", LiNode, element.character);

              var src = "https://image.tmdb.org/t/p/w185" + element.profile_path;

              ImageNode.setAttribute("src", src);
            }
          });
        }
      }

      // function for get reviews section
      function reviewSectionDevelopment(url) {
        getData(url, callback);

        function callback(Data) {
          var appendHere = document.querySelector(".reviews ul")

          if (Data.results.length !== 0) {
            Data.results.forEach(function (element) {
              if (Data.results.indexOf(element) < 3) {
                var LiNode = createNode("li", appendHere, "");
                var SpanNode = createNode("span", LiNode, element.author);
                var info = element.content.slice(0, 1000) + "....";
                var ParagraphNode = createNode("p", LiNode, info);
              }
            });
          } else { document.querySelector(".reviews").classList.add("none") }
        }
      }

      // function for related post development
      function relatedGalleryDevelopment(url, title, completeLoading = false) {
        getData(url, callback);

        function callback(Data) {
          var parentNode = document.querySelector(".related ul");

          if (Data.results.length !== 0) {
            Data.results.forEach(function (element) {
              if (Data.results.indexOf(element) < 6) {
                var LiNode = createNode("li", parentNode, "");
                var FigureNode = createNode("figure", LiNode, "");
                var ImageNode = createNode("img", FigureNode, "");
                var SpanNode = createNode("span", LiNode, element[title]);

                var src = "https://image.tmdb.org/t/p/w92" + element.poster_path;

                ImageNode.setAttribute("src", src);
                LiNode.setAttribute("data-tmdb-id", element.id);
              }
            });
          } else { document.querySelector(".related").classList.add("none") }

          if (completeLoading) { removeLoader(); }
        }
      }
    }

    /*=============================================
      common function for movie and tvshows pages
    =============================================*/
    // function for running the counter
    function runCounter(div) {
      var counters = div.querySelectorAll('.counter');

      if (!div.classList.contains("started")) {
        div.classList.add("started");
        counters.forEach(function (counter) {

          var updateCounter = function () {

            var target = +counter.getAttribute('data-target');
            var count = +counter.getAttribute('data-current');

            var increment = target / 100;

            if (count < target) {
              var currentVal = count + increment;
              counter.setAttribute("data-current", currentVal);
              counter.innerText = Math.floor(currentVal);
              setTimeout(updateCounter, 50);
            } else {
              counter.innerText = target;
            }
          };
          updateCounter();
        });
      }
    }


    // function for searching
    function search(url, query, title) {
      searchFeild.parentElement.parentElement.classList.add("active-search");

      var appendHere = document.querySelector(".dropdown ul");

      if (query !== "") {

        getData(url, callback);

        // function for append data
        function callback(Data) {
          appendHere.innerHTML = "";
          Data.results.forEach(function (element) {
            if (Data.results.indexOf(element) < 5) {
              var LiNode = createNode("li", appendHere, "");
              var AnchorNode = createNode("a", LiNode, element[title]);

              AnchorNode.setAttribute("class", "read-more");
              AnchorNode.setAttribute("data-tmdb-id", element.id);

              AnchorNode.addEventListener("click", function () {
                toTheNextPage(AnchorNode);
              });
            }
          });

          // add condition beacause sometimes user clears the search fiels and still search box appears because of asyncronous search data
          if (searchFeild.value !== "") {
            console.log(searchFeild.value);
            appendHere.classList.add("active-dropdown");
          }
        }
      } else { appendHere.classList.remove("active-dropdown"); }
    }

    // function for banner slider development
    function bannerDevelopment(url, title, date) {
      var appendHere = document.querySelector(".slider");
      appendHere.innerHTML = "";
      getData(url, callback)

      function callback(Data) {
        Data.results.forEach(function (element) {
          var LiNode = createNode("li", appendHere, "");
          var DivNode = createNode("div", LiNode, "");
          var HeadingNode = createNode("h2", DivNode, element[title]);
          // var SpanNode = createNode("span", DivNode, element[date]);

          // var info = element.overview.slice(0, 150) + "....";
          // var PNode = createNode("p", DivNode, info);
          var AnchorNode = createNode("a", DivNode, "read more")

          var src = null;
          if (window.innerWidth <= 767) {
            src = "https://image.tmdb.org/t/p/w92" + element.poster_path;
          } else {
            src = "https://image.tmdb.org/t/p/w780" + element.backdrop_path;
          }

          LiNode.setAttribute("style", "background-image:url(" + src + ")");

          AnchorNode.setAttribute("class", "read-more");
          AnchorNode.setAttribute("data-tmdb-id", element.id);

          AnchorNode.addEventListener("click", function () {
            toTheNextPage(AnchorNode);
          });
        });


        $(document).ready(function () {
          $(appendHere).slick({
            dots: true,
            autoplay: true,
            autoplayspeed: 8000
          });
        });
      }
    }

    // funnction for slider development
    function sliderDevelopment(url, place, title, date, config) {
      place.innerHTML = "";
      getData(url, callback);

      function callback(Data) {
        Data.results.forEach(function (element) {
          var LiNode = createNode("li", place, "", element.id);
          var FigureNode = createNode("figure", LiNode, "");
          var ImageNode = createNode("img", FigureNode, "");
          var HeadingNode = createNode("h4", LiNode, element[title]);
          // var SpanNode = createNode("span", LiNode, element[date]);

          // var info = element.overview.slice(0, 70) + "....";

          // var PNode = createNode("p", LiNode, info);
          var AnchorNode = createNode("a", LiNode, "read more");
          var DivNode = createNode("div", LiNode, "");

          var rating = Math.floor(parseInt(element.vote_average)) / 2;

          for (var i = 1; i <= 5; i++) {
            var RatingNode = createNode("a", DivNode, "rating");

            if (i < rating) {
              RatingNode.setAttribute("class", "rating rated-star");
            } else { RatingNode.setAttribute("class", "rating non-rated-star"); }
          }

          var src = "https://image.tmdb.org/t/p/w92" + element.poster_path;

          ImageNode.setAttribute("src", src);
          AnchorNode.setAttribute("class", "read-more");
          AnchorNode.setAttribute("data-config", config);

          AnchorNode.addEventListener("click", function () {
            toThePaginationPage(AnchorNode)
          });
        });

        // slick slider for carousel effect
        $(document).ready(function () {
          $(place).slick({
            speed: 300,
            autoplay: true,
            autoplayspeed: 5000,
            slidesToShow: 5,
            slidesToScroll: 2,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 540,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });
        });
      }
    }

    // function for galleryDevelopment
    function galleryDevelopment(url, appendHere, title, config, completeLoading = false) {
      getData(url, callback);

      function callback(Data) {
        appendHere.innerHTML = "";

        Data.results.forEach(function (element) {

          if (Data.results.indexOf(element) < 6) {
            var LiNode = createNode("li", appendHere, "");
            var FigureNode = createNode("figure", LiNode, "");
            var ImageNode = createNode("img", FigureNode, "");
            var SpanNode = createNode("span", LiNode, element[title]);

            var src = "https://image.tmdb.org/t/p/w780" + element.backdrop_path;

            ImageNode.setAttribute("src", src);
            LiNode.setAttribute("data-config", config);

            LiNode.addEventListener("click", function () {
              toThePaginationPage(LiNode)
            });
          }
        });

        if (completeLoading) { removeLoader(); }
      }
    }

    function paginationListDevelopment(url, appendHere, title, date) {
      appendHere.innerHTML = "";
      getData(url, callback);

      function callback(Data) {

        Data.results.forEach(function (element) {
          if (element.backdrop_path !== null) {
            var LiNode = createNode("li", appendHere, "", element.id);
            var FigureNode = createNode("figure", LiNode, "");
            var ImageNode = createNode("img", FigureNode, "");
            console.log(element[title]);

            if (element[title].includes(":") || element[title].includes("-") || element[title].includes("(")) {
              var heading = element[title].replace(":", "+");
              heading = heading.replace("-", "+");
              heading = heading.replace("(", "+");
              heading = heading.slice(0, heading.indexOf("+"));

              createNode("h4", LiNode, heading);
            } else { createNode("h4", LiNode, element[title]); }
            var SpanNode = createNode("span", LiNode, element[date]);

            var DivNode = createNode("div", LiNode, "");

            var rating = Math.floor(parseInt(element.vote_average)) / 2;

            for (var i = 1; i <= 5; i++) {
              var RatingNode = createNode("a", DivNode, "rating");

              if (i < rating) {
                RatingNode.setAttribute("class", "rating rated-star");
              } else { RatingNode.setAttribute("class", "rating non-rated-star"); }
            }

            var src = "https://image.tmdb.org/t/p/w92" + element.backdrop_path;

            ImageNode.setAttribute("src", src);
            LiNode.setAttribute("data-tmdb-id", element.id);

            LiNode.addEventListener("click", function () {
              toTheNextPage(LiNode);
            });
          }
        });

        var listArray = Array.from(appendHere.querySelectorAll("li"))
        var index = 0;

        function addAnimationClass() {
          setTimeout(function () {
            if (index < listArray.length) {
              listArray[index].classList.add("slide-in");
              index++;
              addAnimationClass();
            }
          }, 100)
        }

        addAnimationClass();

        // removeLoader();
      }
    }

    function toThePaginationPage(element) {
      var config_data = element.getAttribute("data-config");
      var userid = currentUrl.searchParams.get("userid");
      var category = currentUrl.searchParams.get("category");
      window.location.assign("pagination.html?userid=" + userid + "&category=" + category + "&config=" + config_data);
    }

    // function for moving to the next page 
    function toTheNextPage(element) {
      var category = currentUrl.searchParams.get("category");
      var userid = currentUrl.searchParams.get("userid");
      var uniqueId = element.getAttribute("data-tmdb-id");
      window.location.assign("details.html?userid=" + userid + "&category=" + category + "&uniqueid=" + uniqueId);
    }


    // function for getting data
    function getData(url, callback) {

      var xhr = new XMLHttpRequest();

      var data = null;

      xhr.open('GET', url);
      xhr.onload = function () {

        if (this.status === 200) {
          data = JSON.parse(this.responseText);
          callback(data);
        }
      }

      xhr.onerror = function () {
        var ErrorNode = document.createElement("h1");
        ErrorNode.innerText = "something went wrong ! please refresh the page or try after some time :)"
        document.querySelector(".container").innerHTML = "";
        document.querySelector(".container").appendChild(ErrorNode);
      }

      xhr.send();
    }

    // function for creating elements
    function createNode(node, place, text) {
      var elementNode = document.createElement(node);
      elementNode.innerHTML = text;
      place.appendChild(elementNode);

      return elementNode;
    }
  }
}