$('[data-keybase-url]').draggable({
    containment: 'parent',
    axis: 'x',
    revert: true,
});

$('.icon-keybase').droppable({
    drop(event, ui) {
        location = ui.draggable.attr('data-keybase-url');
    },
});
