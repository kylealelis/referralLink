<?php

use Carbon_Fields\Field;
use Carbon_Fields\Container;

add_action('after_setup_theme', 'load_carbon_fields');
add_action('carbon_fields_register_fields', 'create_options_page');

function load_carbon_fields()
{
    \Carbon_Fields\Carbon_Fields::boot();
}

function create_options_page()
{
    Container::make('theme_options', __('Referral Link Setup'))
        ->set_icon('dashicons-welcome-widgets-menus')
        ->add_fields(
            array(
                Field::make('text', 'service_type', __('Service Type')),

            )
        );
}