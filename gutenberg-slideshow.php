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
    'customLinkUrl' => array(
        'type'    => 'string',
        'default' => '',
    ),
    'customLinkLabel' => array(
        'type'    => 'string',
        'default' => '',
    ),
    'autoScroll' => array(
        'type'    => 'boolean',
        'default' => false,
    ),
    'showDate' => array(
        'type'    => 'boolean',
        'default' => true,
    ),
    'transitionEffect' => array(
        'type'    => 'string',
        'default' => 'fade',
    ),
),
    ) );
    
}
add_action( 'init', 'gs_register_block' );

// Render callback for the block.
function gs_render_slideshow_block( $attributes ) {
    $site_url           = ! empty( $attributes['siteUrl'] ) ? esc_url( $attributes['siteUrl'] ) : 'https://wptavern.com';
    $unique_id          = 'gs-slideshow-' . uniqid();
    $custom_link_url    = ! empty( $attributes['customLinkUrl'] ) ? esc_url( $attributes['customLinkUrl'] ) : '';
    $custom_link_label  = ! empty( $attributes['customLinkLabel'] ) ? sanitize_text_field( $attributes['customLinkLabel'] ) : '';
    $auto_scroll        = ( isset( $attributes['autoScroll'] ) && $attributes['autoScroll'] ) ? 'true' : 'false';
    $show_date          = ( isset( $attributes['showDate'] ) && $attributes['showDate'] ) ? 'true' : 'false';
    $transition_effect  = ! empty( $attributes['transitionEffect'] ) ? sanitize_text_field( $attributes['transitionEffect'] ) : 'fade';

    // Output container with new data attribute:
    $output  = '<div id="' . $unique_id . '" class="gs-slideshow" data-site-url="' . $site_url . '" data-auto-scroll="' . $auto_scroll . '" data-show-date="' . $show_date . '" data-transition-effect="' . $transition_effect . '"></div>';

    if ( $custom_link_url && $custom_link_label ) {
        $output .= '<div class="gs-custom-link">';
        $output .= '<a href="' . $custom_link_url . '" target="_blank" rel="noopener noreferrer">' . $custom_link_label . '</a>';
        $output .= '</div>';
    }

    return $output;
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
