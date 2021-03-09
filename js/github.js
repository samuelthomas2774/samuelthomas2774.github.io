function refreshstars() {
    for (const el of document.getElementsByClassName('github-stars')) {
        const repository = el.getAttribute('data-repository');
        const content = el.getAttribute('data-updatingcontent');
        const beforecontent = el.getAttribute('data-beforecontent') || '';
        const aftercontent = el.getAttribute('data-aftercontent') || '';
        const errorcontent = el.getAttribute('data-errorcontent');

        if (typeof content === 'string') el.innerHTML = content;

        fetch(`https://api.github.com/repos/${repository}`).then(async res => {
            const data = await res.json();
            const stars = Number(data.stargazers_count);

            if (isNaN(stars)) throw new Error('Invalid star count');

            el.innerHTML = beforecontent + stars + aftercontent;
        }).catch(err => {
            el.innerHTML = errorcontent;
        });
    }
}

refreshstars();
