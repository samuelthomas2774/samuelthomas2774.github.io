(function () {

const nxapi_application_ids = [
    '950883021165330493',

    '950905939899351050',
    '966487430981111818',
    '950886725398429726',
    '966102630524919848',
    '966102993177034832',
    '966479353510789150',
    '966148914933792838',
    '966441763973763162',
    '966534181783998474',
    '986683336053370900',
    '966479353510789150',
    '950905573149409280',
    '966388339127234592',
    '966103072407437332',
    '966487507392933929',
    '966534341662482462',
    '966148753365041173',
    '966487348743372850',
    '950886725398429726',
    '966533636969082921',
    '966479069287960656',
    '966478958868693042',
    '966533747023437904',
    '966479236762325013',
    '966148067134939186',
    '966487001119473734',
    '966533261541113857',
    '966103482702647326',
    '966387972574429184',
    '950886725398429726',
    '966487590721163264',
    '950886725398429726',
    '950886725398429726',
    '966387876520685668',
    '966487135194591282',
    '966442004026380368',
    '966388175465496626',
    '966331488322871346',
    '966442617938280526',
    '966478641473130506',
    '1037891425318215820',
    '966534055116021821',
    '966387481375285300',
    '986683336053370900',
    '966330114210152528',
    '966487765447483412',
    '966147770006241340',
    '966330020391952384',
    '966103360589672488',
    '966387596173389864',
    '966533636969082921',
    '950894516104212490',
    '966479489745944737',
    '966441660210872441',
    '950886725398429726',
    '950906152391168020',
    '966441876267864084',
    '966442378095382578',
    '966534448168439872',
    '950908097235415079',
    '966487877343125584',
    '966102704525025301',
    '966534448168439872',
    '966441561158213662',
    '967103709605658735',
    '966329937533497364',
    '966329813780549672',
    '966487135194591282',
    '950886725398429726',
    '966330020391952384',
    '966102432838996009',
    '950886725398429726',
    '966534341662482462',
    '950907272438104064',
    '966148552768249866',
    '1037891823286366288',
    '966534055116021821',
    '950886725398429726',
    '966487674162642974',
    '990631943332827186',
    '986683336053370900',
    '966147770006241340',
    '950886725398429726',
    '966102773642960917',
    '966388261264162836',
    '966148067134939186',
    '950886725398429726',
    '966478424195600385',
    '1037891706483384360',
    '966148353727561738',
    '966102773642960917',
    '966534559929860167',
    '966442166526308463',
    '966331256541429831',
    '966148667201445928',
    '966149007959281755',
    '966103360589672488',
    '986683336053370900',
    '966478025006919680',
    '950907272438104064',
    '966103482702647326',
    '966388060428320789',
    '966442378095382578',
    '966388339127234592',
    '966533545843650570',
    '966478825707937822',
    '967103796134158447',
    '966148353727561738',
    '986683336053370900',
    '966388060428320789',
    '966387699344896073',
    '966331633244471306',
    '966103072407437332',
    '966331402289315850',
    '967103796134158447',
    '966148914933792838',
    '966102773642960917',
    '950907272438104064',
    '966487238944882759',
    '966533747023437904',
    '966442617938280526',
    '966534559929860167',
    '950886725398429726',
    '966534181783998474',
    '950906152391168020',
    '966102704525025301',
    '950907272438104064',
    '986683336053370900',
    '966147956078178364',
    '966148228154265661',
    '966387481375285300',
    '966103273612382248',
    '966329678715559996',
    '966442282372964372',
    '966387799718768690',
    '966487765447483412',
    '966103152753528942',
    '950908097235415079',
    '966479643039399977',
    '966148753365041173',
    '950886725398429726',
    '966148353727561738',
    '966487590721163264',
    '966442512984191076',
];

function getNxTitleId(shop_uri) {
    const match = shop_uri.match(/^https:\/\/ec\.nintendo\.com\/apps\/([0-9a-f]{16})\//i);
    return match?.[1];
}

const encode = string => string ? ('' + string)
    .replace(/[\u00A0-\u9999<>\&"']/g, i => '&#' + i.charCodeAt(0) + ';') : '';

function getActivityImageUrl(activity, key) {
    if (key.startsWith('mp:')) {
        return 'https://media.discordapp.net/' + key.substr(3);
    }

    if (key.startsWith('https:')) {
        return key;
    }

    if (activity.application_id) {
        return 'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + key + '.png';
    }
}

function getElapsedTime(time_ms) {
    const elapsed = Date.now() - time_ms;

    const date = new Date(0);
    date.setMilliseconds(elapsed + (date.getTimezoneOffset() * 1000 * 60));
    return date.toLocaleTimeString('en-GB');
}

function refreshTimestamps(..._el) {
    for (const el of _el.length ? _el : document.getElementsByClassName('discord-activity')) {
        for (const timestamp_el of el.getElementsByClassName('discord-activity-timestamp')) {
            const start_timestamp = parseInt(timestamp_el.dataset.starttimestamp);

            timestamp_el.textContent = getElapsedTime(start_timestamp) + ' elapsed';
        }
    }
}

function renderPresence(el, data, nxapi_data) {
    /** @type {'online'|'idle'|'dnd'|'offline'} */
    const status = data?.discord_status ?? 'offline';

    const custom_status = data?.activities.find(a => a.type === 4);
    const activities = data?.activities.filter(a => [0, 1, 2, 3, 5].includes(a.type))
        .sort((a, b) => a.created_at - b.created_at) ?? [];

    const nx_presence = nxapi_data?.friend.presence;

    if (status === 'online' || status === 'idle' || status === 'dnd' ||
        nx_presence.state === 'ONLINE' || nx_presence.state === 'PLAYING'
    ) {
        const status_text = status === 'online' ? 'Online' : status === 'idle' ? 'Idle' : '';
        const custom_status_html = custom_status ?
            `<span class="discord-status-custom">${encode(custom_status.state)}</span>` : '';
        const status_html = status_text || custom_status_html ? `
            <div class="discord-status">
                <div class="discord-status-icon discord-status-icon-${status}"></div>
                ${status_text}${status_text && custom_status_html ? ' - ' : ''}${custom_status_html}
            </div>
        ` : '';

        let activities_html = '<div class="discord-activities">';

        let nx_presence_activity = nx_presence?.game ? activities.find(a => a.type === 0 &&
            nxapi_application_ids.includes(a.application_id)) : null;

        if (!nx_presence_activity && nx_presence?.game.name) {
            // Create an activity entry
            const activity = {
                application_id: '950883021165330493',
                type: 0,
                name: nx_presence.game.name,
                assets: {
                    large_image: nx_presence.game.imageUri,
                    small_image: nxapi_data?.friend.imageUri,
                },
            };

            activities.unshift(activity);
            nx_presence_activity = activity;
        }

        const nx_title_id = nx_presence?.game.shopUri ? getNxTitleId(nx_presence.game.shopUri) : null;
        const nx_shop_url = nx_title_id ? 'https://fancy.org.uk/api/nxapi/title/' + nx_title_id +
            '/redirect?source=' + encodeURIComponent(location.origin) : nx_presence?.game.shopUri;

        for (const activity of activities) {
            const type_text =
                nx_shop_url && activity === nx_presence_activity ?
                    `Playing on <a href="${encode(nx_shop_url)}">Nintendo Switch</a>` :
                nxapi_application_ids.includes(activity.application_id) ? 'Playing on Nintendo Switch' :
                activity.type === 0 ? 'Playing' :
                activity.type === 1 ? 'Streaming' :
                activity.type === 2 ? 'Listening' :
                activity.type === 3 ? 'Watching' :
                activity.type === 5 ? 'Competing' :
                null;

            const name = nx_presence?.game.name && activity === nx_presence_activity ?
                nx_presence.game.name : activity.name;
            const details = nx_presence && activity === nx_presence_activity &&
                nx_presence.game.name === activity.details ? '' : activity.details;

            const li = activity.assets?.large_image ?
                getActivityImageUrl(activity, activity.assets.large_image) : null;
            const si = activity.assets?.small_image ?
                getActivityImageUrl(activity, activity.assets.small_image) : null;

            const activity_html = `<div class="discord-activity-card">
                ${type_text ? `<div class="discord-activity-type">${type_text}</div>` : ''}
                <div class="discord-activity-inner">
                    ${li ? `<div class="discord-activity-images">
                        <div class="discord-activity-icon-large" style="${encode('background-image: url(' +
                            JSON.stringify(li) + ');')}" title="${encode(activity.assets?.large_text)}"></div>
                        ${si ? `
                            <div class="discord-activity-icon-small" style="${encode('background-image: url(' +
                                JSON.stringify(si) + ');')}" title="${encode(activity.assets?.small_text)}"></div>
                        ` : ''}
                    </div>` : ''}
                    <div class="discord-activity-info">
                        <div class="discord-activity-name" title="${encode(name)}">${encode(name)}</div>
                        <div class="discord-activity-details" title="${encode(details)}">${encode(details)}</div>
                        <div class="discord-activity-state" title="${encode(activity.state)}">${encode(activity.state)}</div>
                        ${activity.timestamps?.start ? `<div class="discord-activity-timestamp"
                            data-starttimestamp="${encode(activity.timestamps.start)}"></div>` : ''}
                        ${'' && encode(JSON.stringify(activity))}
                    </div>
                </div>
            </div>`;

            activities_html += activity_html;
        }

        activities_html += '</div>';

        el.innerHTML = status_html + activities_html;

        refreshTimestamps(el);
    } else {
        el.innerHTML = '';
    }
}

class LanyardManager {
    constructor() {
        /** @type {Set<string>} */
        this.monitoring = new Set();
        /** @type {WebSocket | null} */
        this.ws = null;

        this.ws = this.createSocket();

        this.nxapi_urls = new Map();
        this.last_data = new WeakMap();
    }

    set(ids) {
        let updated = false;

        for (const id of ids) {
            if (this.monitoring.has(id)) continue;
            this.monitoring.add(id);
            updated = true;
        }

        for (const id of this.monitoring.values()) {
            if (ids.includes(id)) continue;
            this.monitoring.delete(id);
            this.nxapi_urls.delete(id);
            updated = true;
        }

        if (updated && this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_ids: [...this.monitoring.values()],
                },
            }));
        }
    }

    createSocket() {
        console.debug('Connecting to Lanyard');

        const ws = new WebSocket('wss://api.lanyard.rest/socket');

        /** @type {number | null} */
        let interval = null;

        ws.onopen = event => {
            console.debug('Connected to Lanyard');
        };

        ws.onclose = event => {
            console.debug('Lanyard connection closed', event.data);

            this.ws = null;
            clearInterval(interval);

            this.handleClose();
        };

        ws.onmessage = event => {
            const data = JSON.parse(event.data);
            console.debug('Received message from Lanyard', data, event);

            if (data.op === 0) {
                // Event
                this.handleEvent(data.t, data.d, data, event);
            }

            if (data.op === 1) {
                // Hello
                // {"op":1,"d":{"heartbeat_interval":30000}}

                clearInterval(interval);
                interval = setInterval(() => {
                    ws.send(JSON.stringify({
                        op: 3,
                    }));
                }, data.d.heartbeat_interval ?? 30000);

                ws.send(JSON.stringify({
                    op: 2,
                    d: {
                        subscribe_to_ids: [...this.monitoring.values()],
                    },
                }));
            }
        };

        return ws;
    }

    handleClose() {
        for (const el of document.getElementsByClassName('discord-activity')) {
            this.last_data.delete(el);

            const nxapi_data = nxapi.last_data.get(el.dataset['nxapi-url']);
            if (nxapi_data) renderPresence(el, null, nxapi_data);
            else el.innerHTML = '';
        }

        this.ws = this.createSocket();
    }

    handleEvent(type, data, message, event) {
        if (type === 'INIT_STATE') {
            this.handleInitialPresenceData(data);
        }

        if (type === 'PRESENCE_UPDATE') {
            this.handleUpdatedPresenceData(data.user_id ?? data.discord_user.id, data);
        }
    }

    handleInitialPresenceData(data) {
        for (const el of document.getElementsByClassName('discord-activity')) {
            const userid = el.dataset.userid;
            const presence = data[userid];
            if (!presence) continue;

            this.last_data.set(el, presence);

            const nxapi_url = presence.kv.nxapi_presence_url;
            nxapi_url ? this.nxapi_urls.set(userid, nxapi_url) : this.nxapi_urls.delete(userid);
            const nxapi_data = nxapi.last_data.get(nxapi_url ?? el.dataset['nxapi-url']);

            renderPresence(el, presence, nxapi_data);
        }

        nxapi.set([...this.nxapi_urls.values(), ...[...document.getElementsByClassName('discord-activity')]
            .map(e => e.dataset['nxapi-url']).filter(u => u)]);
    }

    handleUpdatedPresenceData(id, data) {
        for (const el of document.getElementsByClassName('discord-activity')) {
            if (id !== el.dataset.userid) continue;

            this.last_data.set(el, data);

            const nxapi_url = data.kv.nxapi_presence_url;
            nxapi_url ? this.nxapi_urls.set(id, nxapi_url) : this.nxapi_urls.delete(id);
            const nxapi_data = nxapi.last_data.get(nxapi_url ?? el.dataset['nxapi-url']);

            renderPresence(el, data, nxapi_data);
        }

        nxapi.set([...this.nxapi_urls.values(), ...[...document.getElementsByClassName('discord-activity')]
            .map(e => e.dataset['nxapi-url']).filter(u => u)]);
    }
}

class NxPresenceManager {
    constructor() {
        /** @type {Map<string, EventSource>} */
        this.monitoring = new Map();

        this.last_data = new Map();
    }

    add(id) {
        if (this.monitoring.has(id)) return;

        const events = this.createSocket(id, id);
        this.monitoring.set(id, events);
    }

    remove(id) {
        const events = this.monitoring.get(id);
        events?.close();
        this.monitoring.delete(id);
        this.last_data.delete(id);
    }

    set(ids) {
        for (const id of this.monitoring.keys()) {
            if (!ids.includes(id)) this.remove(id);
        }

        for (const id of ids) {
            this.add(id);
        }
    }

    createSocket(id, url) {
        const events = new EventSource(url);

        events.addEventListener('open', event => {
            console.log('nxapi presence connected', event);
        });

        events.addEventListener('error', event => {
            console.log('nxapi presence error', event);
            this.handleError(id, event, events);
        });

        events.addEventListener('friend', event => {
            const data = JSON.parse(event.data);
            this.handleUpdatedFriendData(id, data, events);
        });

        return events;
    }

    handleError(id, event, events) {
        this.last_data.delete(id);

        for (const el of document.getElementsByClassName('discord-activity')) {
            const lanyard_data = lanyard.last_data.get(el);
            renderPresence(el, lanyard_data, null);
        }
    }

    handleUpdatedFriendData(id, data, events) {
        if (this.last_data.has(id)) {
            this.last_data.get(id).friend = data;
        } else {
            this.last_data.set(id, {friend: data});
        }

        for (const el of document.getElementsByClassName('discord-activity')) {
            const lanyard_data = lanyard.last_data.get(el);
            const nxapi_url = lanyard_data?.kv.nxapi_presence_url ?? el.dataset['nxapi-url'];
            if (nxapi_url !== id) continue;
            renderPresence(el, lanyard_data, this.last_data.get(id));
        }
    }
}

const lanyard = new LanyardManager();
const nxapi = new NxPresenceManager();
const ids = new Set();

for (const el of document.getElementsByClassName('discord-activity')) {
    const userid = el.dataset.userid;    
    ids.add(userid);

    const nxapi_url = el.dataset['nxapi-url'];
    if (nxapi_url) nxapi.add(nxapi_url);
}

lanyard.set([...ids]);

setInterval(refreshTimestamps, 1000);

})();
