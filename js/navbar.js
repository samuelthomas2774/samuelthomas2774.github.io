$('#navbar').on('show.bs.collapse', function () {
    $('body').addClass('navbar-open');
}).on('hide.bs.collapse', function () {
    $('body').removeClass('navbar-open');
});

$('.close-navbar-link').on('click', function () {
    $('#navbar').collapse('hide');
});
