( function( blocks, element, editor, components, i18n ) {
    var el = element.createElement;
    var InspectorControls = editor.InspectorControls;
    var TextControl = components.TextControl;
    var PanelBody = components.PanelBody;

    blocks.registerBlockType( 'gs/slideshow', {
        title: i18n.__( 'Slideshow Block', 'gs-slideshow' ),
        icon: 'images-alt2',
        category: 'widgets',
        attributes: {
            siteUrl: {
                type: 'string',
                default: 'https://wptavern.com'
            },
            // You can add more attributes here (e.g., toggles for metadata, auto-scroll, etc.)
        },
        edit: function( props ) {
            var attributes = props.attributes;
            return [
                el( InspectorControls, { key: 'inspector' },
                    el( PanelBody, { title: i18n.__( 'Settings', 'gs-slideshow' ), initialOpen: true },
                        el( TextControl, {
                            label: i18n.__( 'Site URL', 'gs-slideshow' ),
                            value: attributes.siteUrl,
                            onChange: function( newUrl ) {
                                props.setAttributes( { siteUrl: newUrl } );
                            }
                        } )
                        // Add additional controls here as needed.
                    )
                ),
                el( 'div', { className: props.className, style: { border: '1px solid #ddd', padding: '1em' } },
                    el( 'p', {}, i18n.__( 'Slideshow Block Preview', 'gs-slideshow' ) ),
                    el( 'p', {}, i18n.__( 'Fetching posts from:', 'gs-slideshow' ) + ' ' + attributes.siteUrl )
                )
            ];
        },
        save: function() {
            // Save is handled dynamically via render_callback.
            return null;
        }
    } );
} )(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor || window.wp.editor,
    window.wp.components,
    window.wp.i18n
);
