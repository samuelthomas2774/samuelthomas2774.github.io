function refreshgitlabstars() {
    for (const el of document.getElementsByClassName('gitlab-stars')) {
        const host = el.getAttribute('data-gitlab-server') || 'gitlab.com';
        const repository = parseInt(el.getAttribute('data-repository'));
        const content = el.getAttribute('data-updatingcontent');
        const beforecontent = el.getAttribute('data-beforecontent') || '';
        const aftercontent = el.getAttribute('data-aftercontent') || '';
        const errorcontent = el.getAttribute('data-errorcontent');

        if (isNaN(repository)) continue;

        if (typeof content === 'string') el.innerHTML = content;

        fetch(`https://${host}/api/v4/projects/${repository}`).then(async res => {
            const data = await res.json();

            el.innerHTML = beforecontent + Number(data.star_count) + aftercontent;
        }).catch(err => {
            el.innerHTML = errorcontent;
        });
    }
}

refreshgitlabstars();
