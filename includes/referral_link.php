<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<?php

add_shortcode('referral', 'show_referral_form');

add_action('rest_api_init', 'create_rest_endpoint');

add_action('init', 'create_submissions_page');

add_action('add_meta_boxes', 'create_meta_box');

add_filter('manage_submission_posts_columns', 'custom_submission_columns');

add_action('manage_submission_posts_custom_column', 'fill_submission_columns', 10, 2);

add_action('admin_init', 'setup_search');

add_action('wp_enqueue_scripts', 'add_scripts_and_styles');

function add_scripts_and_styles() {
    wp_register_style( 'referral-style', plugins_url('/templates/referral_link.css', __FILE__) );
    wp_enqueue_style( 'referral-style' );
    wp_register_script('referral_link.js', plugins_url('/templates/referral_link.js', __FILE__), array('jquery'), null, true );
    wp_enqueue_script('referral_link.js');
}

function setup_search() {
    global $typenow;
    if($typenow == 'submission') {
        add_filter('posts_search', 'submission_search_override', 10, 2);
    }
}

function submission_search_override($search, $query) {
    global $wpdb;
    if($query->is_main_query() && !empty($query->query['s'])) {
        $sql = "
            or exists (
                select * from {$wpdb->postmeta} where post_id={$wpdb->posts}.ID
                and meta_key in ('name', 'email', 'phone')
                and meta_value like %s
            )
        ";
        $like = '%'.$wpdb->esc_like($query->query['s']).'%';
        $search = preg_replace(
            "#\({$wpdb->posts}.post_title LIKE [^)] +\)\K#",
            $wpdb->prepare($sql, $like),
            $search
        );
    }

    return $search;
}

function fill_submission_columns($column, $post_id) {
    switch($column) {
        case 'name':
            echo get_post_meta($post_id, 'nameInput', true);
            break;
        case 'email':
            echo get_post_meta($post_id, 'emailInput', true);
            break;
        case 'phone':
            echo get_post_meta($post_id, 'phoneInput', true);
            break;
        case 'message':
            echo get_post_meta($post_id, 'messageInput', true);
            break;
    }
}

function custom_submission_columns($columns) {
    $columns = array(
        'cb' => $columns['cb'],
        'name' => __('Name', 'referral-plugin'),
        'email' => __('Email', 'referral-plugin'),
        'phone' => __('Phone', 'referral-plugin'),
        'message' => __('Message', 'referral-plugin'),
    );
    return $columns;
}
function create_meta_box() {
    add_meta_box('custom_form', 'Submission', 'display_submission', 'submission');
}

function display_submission() {
    $postmetas = get_post_meta(get_the_ID());
    unset($postmetas['_edit_lock']);

    echo '<ul>';
    foreach($postmetas as $key => $value) {
        echo '<li> <strong>'.$key.'</strong>:<br>'.$value[0].'</li>';
    }
    echo '</ul>';
}

function create_submissions_page() {
    $args = [
        'public' => true,
        'has_archive' => true,
        'labels' => [
            'name' => 'Referral Link Submissions',
            'singular_name' => 'Submission'
        ],
        'supports' => false,
    ];
    register_post_type('submission', $args);
}

function show_referral_form() {
    include MY_PLUGIN_PATH.'/includes/templates/referral_link.php';
}

function create_rest_endpoint() {
    register_rest_route(
        'v1/referral_link',
        'submit',
        array(
            'methods' => 'POST',
            'callback' => 'handle_inquiry',
        )
    );
}

function handle_inquiry($data) {
    $params = $data->get_params();
    if(!wp_verify_nonce($params['_wpnonce'], 'wp_rest')) {
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

    foreach($params as $label => $value) {
        $message .= '<strong>'.ucfirst($label).'</strong>: '.$value.'<br>';
        add_post_meta($post_id, $label, $value);
    }

    wp_mail($admin_email, $subject, $message, $headers);
    return new WP_REST_Response('Message was sent', 200);
}