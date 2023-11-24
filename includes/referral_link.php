<?php

add_shortcode('referral', 'show_referral_form');

add_action('rest_api_init', 'create_rest_endpoint');

function show_referral_form()
{
    include MY_PLUGIN_PATH . '/includes/templates/referral_link.php';
}

function create_rest_endpoint()
{
    register_rest_route(
        'v1/referral_link',
        'submit',
        array(
            'methods' => 'POST',
            'callback' => 'handle_inquiry',
        )
    );
}

function handle_inquiry($data)
{
    $params = $data->get_params();
    if (!wp_verify_nonce($params['_wpnonce'], 'wp_rest')) {
        return new WP_REST_Response('Message not sent', 422);
    }

    unset($params['_wpnonce']);
    unset($params['_wp_http_referer']);

    // Send email message
    $headers = [];

    $admin_email = get_bloginfo('admin_email');
    $admin_name = get_bloginfo('name');

    $headers[] = "From: {$admin_name} <{$admin_email}>";
    $headers[] = "Reply-to: {$params['nameInput']} <{$params['emailInput']}>";
    $headers[] = "Content-Type: text/html";

    $subject = "Testing site sample with name {$params['nameInput']}";

    $message = '';
    $message .= "<h1>Message sent from {$params['nameInput']}</h1>";

    foreach ($params as $label => $value) {
        $message .= '<strong>' . ucfirst($label) . '</strong>: ' . $value .'<br>';
    }

    wp_mail($admin_email, $subject, $message, $headers);
    return new WP_REST_Response('Message was sent', 200);
}