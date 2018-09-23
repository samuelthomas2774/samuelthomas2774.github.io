$(document).ready($.refreshgitlabstars = function() {
    $('.gitlab-stars').each(function() {
        var $this = $(this),
            host = $this.attr('data-gitlab-server') || 'gitlab.com',
            repository = $this.attr('data-repository'),
            content = $this.attr('data-updatingcontent'),
            beforecontent = $this.attr('data-beforecontent') || '',
            aftercontent = $this.attr('data-aftercontent') || '',
            errorcontent = $this.attr('data-errorcontent');

        if (typeof content == 'string')
            $this.html(content);

        $.ajax({
            url: 'https://' + host + '/api/v4/projects/' + repository,
            method: 'GET',
            success(response) {
                if (typeof response == 'string')
                    response = $.parseJSON(response);

                $this.html(beforecontent + response.star_count + aftercontent);
            },
            error() {
                $this.html(errorcontent);
            }
        });
    });
});
