let messenger = null;

$(document).ready(init);

function init() {
    addEvents();
    initMessenger();
}

function addEvents() {
    addLogoutEvent();
}

function initMessenger() {
    if (!$('#messenger').length) return;

    messenger = new Messenger();
}

function addLogoutEvent() {
    const $logout = $('#auth-logout');

    if (!$logout.length) return;

    $logout.on('click', e => {
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: location.origin + '/api/auth/logout',
            success: () => {
                location.href = location.origin
            },
            error: (err) => {
                console.error(err);
            }
        });
    });
}