$(document).ready(init);

function init() {
    addEvents();
}

function addEvents() {
    addLoginEvent();
    addRegistrationEvent();
}

function addLoginEvent() {
    const $form = $('#login-form');

    if (!$form.length) return;

    const $submit = $form.find('#login-submit');
    
    $form.on('submit', e => {
        e.preventDefault();
    
        let data = new FormData($form[0]);
        data = Object.fromEntries(data);
    
        $.ajax({
            method: 'post',
            url: location.origin + '/api/auth/login',
            data,
            success: () => {
                location.href = location.origin;
            },
            error: (err) => {
                console.error(err);
            }
        });
    });
}

function addRegistrationEvent() {
    const $form = $('#reg-form');

    const $submit = $form.find('#reg-submit');
    
    $form.on('submit', e => {
        e.preventDefault();
    
        let data = new FormData($form[0]);
        data = Object.fromEntries(data);
    
        $.ajax({
            method: 'post',
            url: location.origin + '/api/users/create',
            data,
            success: () => {
                location.href = location.origin;
            },
            error: (err) => {
                console.error(err);
            }
        });
    });
}