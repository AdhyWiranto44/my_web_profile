$(".nav-item").on("click", function (e) {
    let href = $(this).attr("href");
    let hrefElement = $(href);

    $("html, body").animate(
        {
            scrollTop: hrefElement.offset().top - 80,
        },
        1250,
        "easeInOutExpo"
    );

    e.preventDefault();
});

$(".goTop").on("click", function (e) {
    let href = $(this).attr("href");
    let hrefElement = $(href);

    $("html, body").animate(
        {
            scrollTop: hrefElement.offset().top - 80,
        },
        1250,
        "easeInOutExpo"
    );

    e.preventDefault();
});

let navbar = document.querySelector(".navbarOnScroll");
let goTop = document.querySelector(".goTop");
let navbarClass =
    "navbarOnScroll navbar navbar-expand-lg navbar-light fixed-top";

window.onscroll = windowScroll;

function windowScroll(e) {
    let offset = window.pageYOffset;

    if (offset > 70) {
        navbar.className = navbarClass;
        goTop.className = "goTop btn btn-dark fixed-bottom ml-3 mb-2 rounded-circle shadow";
    } else {
        navbar.className = navbarClass + " d-none";
        goTop.className = "goTop btn btn-dark fixed-bottom ml-3 mb-2 rounded-circle shadow d-none";
    }

    console.log(navbar.className);
}

$(document).ready(function () {
    
    // my latest video
    var key = 'AIzaSyCs2cNnwQbCYd0DKRhfTZPEHVgBmG8ww2E';
    var playlistId = 'PL76Rc5GEPL9p-shFfNEagPZg3MytMFnBF';
    var URL = 'https://www.googleapis.com/youtube/v3/playlistItems';


    var options = {
        part: 'snippet',
        key: key,
        maxResults: 1,
        playlistId: playlistId
    }

    loadVids();

    function loadVids() {
        $.getJSON(URL, options, function (data) {
            var id = data.items[0].snippet.resourceId.videoId;
            mainVid(id);
            resultsLoop(data);
        });
    }

    function mainVid(id) {
        $('#video').html(`
					<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
				`);
    }

		
    function resultsLoop(data) {

        $.each(data.items, function (i, item) {

            var thumb = item.snippet.thumbnails.medium.url;
            var title = item.snippet.title;
            var desc = item.snippet.description.substring(0, 500);
            var vid = item.snippet.resourceId.videoId;

            $('.latestVideoTitle').append(`${title}`);
            $('.latestVideoDesc').append(`${desc}`);

        });
    }

		// CLICK EVENT
    $('main').on('click', 'article', function () {
        var id = $(this).attr('data-key');
        mainVid(id);
    });

});
