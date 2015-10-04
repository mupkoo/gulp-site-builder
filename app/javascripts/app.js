import $ from 'jquery';

$(function () {
    $('img').on('click', function () {
        $(this).toggleClass('faded');
    });
});
