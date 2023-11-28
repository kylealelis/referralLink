<?php

add_shortcode('referral', 'show_referral_form');

add_action('rest_api_init', 'create_rest_endpoint');

add_action('init', 'create_submissions_page');

add_action('add_meta_boxes', 'create_meta_box');

function create_meta_box()
{
    add_meta_box('custom_form', 'Submission', 'display_submission', 'submission');
}

function display_submission()
{
    $postmetas = get_post_meta(get_the_ID());
    unset($postmetas['_edit_lock']);

    echo '<ul>';
    foreach ($postmetas as $key => $value) {
        echo '<li> <strong>' . $key . '</strong>:<br>'. $value[0] .'</li>';
    }
    echo '</ul>';
}

function create_submissions_page()
{
    $args = [
        'public' => true,
        'has_archive' => true,
        'labels' => [
            'name' => 'Submissions',
            'singular_name' => 'Submission'
        ],
        'supports' => false,
    ];
    register_post_type('submission', $args);
}

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

    $postarr = [
        'post_title' => $params['nameInput'],
        'post_type' => 'submission',
        'post_status' => 'publish',
    ];

    $post_id = wp_insert_post($postarr);

    foreach ($params as $label => $value) {
        $message .= '<strong>' . ucfirst($label) . '</strong>: ' . $value . '<br>';
        add_post_meta($post_id, $label, $value);
    }

    wp_mail($admin_email, $subject, $message, $headers);
    return new WP_REST_Response('Message was sent', 200);
}