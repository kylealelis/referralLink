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
        ->add_tab(__('Jollibee'), array(
            Field::make('text', 'crb_first_name', __('First Name')),
            Field::make('text', 'crb_last_name', __('Last Name')),
            Field::make('text', 'crb_position', __('Position')),
        )
        )
        ->add_tab(__('Profile'), array(
            Field::make('text', 'crb_first_name1', __('First Name')),
            Field::make('text', 'crb_last_name1', __('Last Name')),
            Field::make('text', 'crb_position1', __('Position')),
        )
        )
    ;
}