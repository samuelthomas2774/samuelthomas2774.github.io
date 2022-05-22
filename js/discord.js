(function () {

const encode = string => string ? ('' + string)
    .replace(/[\u00A0-\u9999<>\&"']/g, i => '&#' + i.charCodeAt(0) + ';') : '';

function getActivityImageUrl(activity, key) {
    if (key.startsWith('mp:')) {
        return 'https://media.discordapp.net/' + key.substr(3);
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

function renderPresence(el, data) {
    /** @type {'online'|'idle'|'dnd'|'offline'} */
    const status = data.discord_status;

    const custom_status = data.activities.find(a => a.type === 4);
    const activities = data.activities.filter(a => [0, 1, 2, 3, 5].includes(a.type))
        .sort((a, b) => a.created_at - b.created_at);

    if (status === 'online' || status === 'idle' || status === 'dnd') {
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

        for (const activity of activities) {
            const type_text =
                activity.type === 0 ? 'Playing' :
                activity.type === 1 ? 'Streaming' :
                activity.type === 2 ? 'Listening' :
                activity.type === 3 ? 'Watching' :
                activity.type === 5 ? 'Competing' :
                null;

            const li = activity.assets?.large_image ?
                getActivityImageUrl(activity, activity.assets.large_image) : null;
            const si = activity.assets?.small_image ?
                getActivityImageUrl(activity, activity.assets.small_image) : null;

            const activity_html = `<div class="discord-activity-card">
                ${type_text ? `<div class="discord-activity-type">${encode(type_text)}</div>` : ''}
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
                        <div class="discord-activity-name" title="${encode(activity.name)}">${encode(activity.name)}</div>
                        <div class="discord-activity-details" title="${encode(activity.details)}">${encode(activity.details)}</div>
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
            el.innerHTML = '';
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
            renderPresence(el, presence);
        }
    }

    handleUpdatedPresenceData(id, data) {
        for (const el of document.getElementsByClassName('discord-activity')) {
            if (id !== el.dataset.userid) continue;
            renderPresence(el, data);
        }
    }
}

const lanyard = new LanyardManager();
const ids = new Set();

for (const el of document.getElementsByClassName('discord-activity')) {
    const userid = el.dataset.userid;

    ids.add(userid);
}

lanyard.set([...ids]);

setInterval(refreshTimestamps, 1000);

})();
