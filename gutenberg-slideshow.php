<?php
/**
 * Plugin Name: Gutenberg Slideshow Block
 * Description: A custom Gutenberg block that fetches posts via the WP REST API and displays them as a slideshow.
 * Version: 2.0.0
 * Author: Yashvardhan Kapse
 * License: GPL2+
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Register the block and its assets.
function gs_register_block() {

    // Register the block editor script.
    wp_register_script(
        'gs-block-editor-script',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
    );

    // Register editor-only styles.
    wp_register_style(
        'gs-block-editor-style',
        plugins_url( 'assets/editor-style.css', __FILE__ ),
        array( 'wp-edit-blocks' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/editor-style.css' )
    );

    // Register front-end styles.
    wp_register_style(
        'gs-block-frontend-style',
        plugins_url( 'assets/style.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/style.css' )
    );

    // Register the dynamic block.
    register_block_type( 'gs/slideshow', array(
        'editor_script'   => 'gs-block-editor-script',
        'editor_style'    => 'gs-block-editor-style',
        'style'           => 'gs-block-frontend-style',
        'render_callback' => 'gs_render_slideshow_block',
        'attributes'      => array(
            'siteUrl' => array(
                'type'    => 'string',
                'default' => 'https://wptavern.com',
            ),
            // Additional attributes (e.g., toggles for metadata or auto-scroll) can be added here.
        ),
    ) );
}
add_action( 'init', 'gs_register_block' );

// Render callback for the block.
function gs_render_slideshow_block( $attributes ) {
    // Get the site URL attribute or default.
    $site_url = isset( $attributes['siteUrl'] ) ? esc_url( $attributes['siteUrl'] ) : 'https://wptavern.com';
    // Create a unique ID for each block instance.
    $unique_id = 'gs-slideshow-' . uniqid();
    // Output a container with a data attribute for the site URL.
    return '<div id="' . $unique_id . '" class="gs-slideshow" data-site-url="' . $site_url . '"></div>';
}

// Enqueue the front-end script that powers the slideshow.
function gs_enqueue_frontend_script() {
    // Only load the script if the block is present on the page.
    if ( has_block( 'gs/slideshow' ) ) {
        wp_enqueue_script(
            'gs-frontend-script',
            plugins_url( 'assets/script.js', __FILE__ ),
            array(),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/script.js' ),
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'gs_enqueue_frontend_script' );
