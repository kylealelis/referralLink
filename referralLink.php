<?php
/*
 * Plugin Name: Referral Link
 * Description: Referral Link plugin built for Kabayan Kuwait to redirect its users to several different services
 * Version: 1.0
 * Author: Kyle Angelo Alelis
 * Text Domain: referral-plugin
 */

if (!defined('ABSPATH')) {
    die('You cannot be here...');
}

if (!class_exists('ReferralLink')) {
    class ReferralLink
    {
        public function __construct()
        {
            define('MY_PLUGIN_PATH', plugin_dir_path(__FILE__)); // defining path for plugin

            require_once(MY_PLUGIN_PATH . '/vendor/autoload.php'); // setting up Carbon Fields
        }

        public function initialize()
        {
            include_once MY_PLUGIN_PATH . 'includes/utilities.php';
            include_once MY_PLUGIN_PATH . 'includes/options-page.php';
            include_once MY_PLUGIN_PATH . 'includes/referral_link.php';
        }
    }

    $referral_link = new ReferralLink;
    $referral_link->initialize();
}