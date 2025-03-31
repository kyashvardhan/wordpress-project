( function( blocks, element, editor, components, i18n ) {
    var el = element.createElement;
    var InspectorControls = editor.InspectorControls;
    var TextControl = components.TextControl;
    var ToggleControl = components.ToggleControl;
    var SelectControl = components.SelectControl;
    var PanelBody = components.PanelBody;

    blocks.registerBlockType( 'gs/slideshow', {
        title: i18n.__( 'Slideshow Block', 'gs-slideshow' ),
        icon: 'images-alt2',
        category: 'widgets',
        attributes: {
            siteUrl: { type: 'string', default: 'https://wptavern.com' },
            customLinkUrl: { type: 'string', default: '' },
            customLinkLabel: { type: 'string', default: '' },
            autoScroll: { type: 'boolean', default: false },
            showDate: { type: 'boolean', default: true },
            transitionEffect: { type: 'string', default: 'fade' },
        },
        edit: function( props ) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;

            return [
                el( InspectorControls, { key: 'inspector' },
                    el( PanelBody, { title: i18n.__( 'Settings', 'gs-slideshow' ), initialOpen: true },
                        el( TextControl, {
                            label: i18n.__( 'Site URL', 'gs-slideshow' ),
                            value: attributes.siteUrl,
                            onChange: function( newUrl ) { setAttributes( { siteUrl: newUrl } ); }
                        } ),
                        el( TextControl, {
                            label: i18n.__( 'Custom Link URL', 'gs-slideshow' ),
                            value: attributes.customLinkUrl,
                            onChange: function( val ) { setAttributes( { customLinkUrl: val } ); }
                        } ),
                        el( TextControl, {
                            label: i18n.__( 'Custom Link Label', 'gs-slideshow' ),
                            value: attributes.customLinkLabel,
                            onChange: function( val ) { setAttributes( { customLinkLabel: val } ); }
                        } ),
                        el( ToggleControl, {
                            label: i18n.__( 'Auto Scroll', 'gs-slideshow' ),
                            checked: attributes.autoScroll,
                            onChange: function( newVal ) { setAttributes( { autoScroll: newVal } ); }
                        } ),
                        el( ToggleControl, {
                            label: i18n.__( 'Show Post Date', 'gs-slideshow' ),
                            checked: attributes.showDate,
                            onChange: function( newVal ) { setAttributes( { showDate: newVal } ); }
                        } ),
                        el( SelectControl, {
                            label: i18n.__( 'Transition Effect', 'gs-slideshow' ),
                            value: attributes.transitionEffect,
                            options: [
                                { label: 'Fade', value: 'fade' },
                                { label: 'Slide', value: 'slide' }
                            ],
                            onChange: function( newVal ) { setAttributes( { transitionEffect: newVal } ); }
                        } )
                    )
                ),
                el( 'div', { className: props.className, style: { border: '1px solid #ddd', padding: '1em' } },
                    el( 'p', {}, i18n.__( 'Slideshow Block Preview', 'gs-slideshow' ) ),
                    el( 'p', {}, i18n.__( 'Fetching posts from:', 'gs-slideshow' ) + ' ' + attributes.siteUrl ),
                    ( attributes.customLinkUrl && attributes.customLinkLabel ) && el(
                        'p',
                        {},
                        i18n.__( 'Custom Link:', 'gs-slideshow' ) + ' ' + attributes.customLinkLabel
                    ),
                    el( 'p', {}, i18n.__( 'Transition Effect:', 'gs-slideshow' ) + ' ' + attributes.transitionEffect )
                )
            ];
        },
        save: function() {
            // Rendered dynamically via PHP.
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
