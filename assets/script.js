document.addEventListener('DOMContentLoaded', function() {
    var slideshows = document.querySelectorAll('.gs-slideshow');
    slideshows.forEach(function(container) {
        var siteUrl         = container.getAttribute('data-site-url') || 'https://wptavern.com';
        var autoScroll      = container.getAttribute('data-auto-scroll') === 'true';
        var showDate        = container.getAttribute('data-show-date') === 'true';
        var transitionEffect = container.getAttribute('data-transition-effect') || 'fade';

        var apiUrl = siteUrl.replace(/\/$/, '') + '/wp-json/wp/v2/posts?per_page=5&_embed';
        var cacheKey = 'gs_cache_' + siteUrl;
        var cached = localStorage.getItem(cacheKey);

        if ( cached ) {
            try {
                var data = JSON.parse(cached);
                if ( Date.now() - data.timestamp < 10 * 60 * 1000 ) {
                    buildSlideshow( container, data.posts, autoScroll, showDate, transitionEffect );
                    return;
                }
            } catch (e) {
                console.error('Cache parse error', e);
            }
        }

        fetch( apiUrl )
            .then(function( response ) { return response.json(); })
            .then(function( posts ) {
                localStorage.setItem( cacheKey, JSON.stringify({ timestamp: Date.now(), posts: posts }) );
                buildSlideshow( container, posts, autoScroll, showDate, transitionEffect );
            })
            .catch(function( error ) {
                console.error( 'Error fetching posts:', error );
                container.innerHTML = '<p>Error loading slideshow.</p>';
            } );
    });

    function buildSlideshow( container, posts, autoScroll, showDate, transitionEffect ) {
        if ( !posts || posts.length === 0 ) {
            container.innerHTML = '<p>No posts found.</p>';
            return;
        }

        var slider = document.createElement('div');
        slider.className = 'gs-slider';
        // Apply the transition effect as a class.
        slider.classList.add( transitionEffect );

        if ( transitionEffect === 'slide' ) {
            slider.style.display = 'flex';
            slider.style.transition = 'transform 0.5s ease-in-out';
        }

        posts.forEach(function(post, index) {
            var slide = document.createElement('div');
            slide.className = 'gs-slide';

            if ( transitionEffect === 'fade' ) {
                slide.style.display = ( index === 0 ) ? 'block' : 'none';
            } else if ( transitionEffect === 'slide' ) {
                slide.style.flex = '0 0 100%';
            }

            var title = post.title.rendered;
            var link = post.link;
            var date = new Date(post.date).toLocaleDateString();
            var featuredImg = ( post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url ) || '';

            var content = '';
            if ( featuredImg ) {
                content += '<a href="' + link + '" target="_blank"><img src="' + featuredImg + '" alt="' + title + '"></a>';
            }
            content += '<h3><a href="' + link + '" target="_blank">' + title + '</a></h3>';
            if ( showDate ) {
                content += '<p>' + date + '</p>';
            }
            slide.innerHTML = content;
            slider.appendChild(slide);
        });

        container.innerHTML = '';
        container.appendChild(slider);

        var prevBtn = document.createElement('button');
        prevBtn.className = 'gs-prev';
        prevBtn.textContent = 'Prev';
        var nextBtn = document.createElement('button');
        nextBtn.className = 'gs-next';
        nextBtn.textContent = 'Next';
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        var currentIndex = 0;
        var slides = slider.querySelectorAll('.gs-slide');

        function showSlide(index) {
            if ( transitionEffect === 'fade' ) {
                if ( index < 0 ) { index = slides.length - 1; }
                if ( index >= slides.length ) { index = 0; }
                slides.forEach(function(slide, i) {
                    slide.style.display = ( i === index ) ? 'block' : 'none';
                });
            } else if ( transitionEffect === 'slide' ) {
                if ( index < 0 ) { index = slides.length - 1; }
                if ( index >= slides.length ) { index = 0; }
                slider.style.transform = 'translateX(-' + ( index * 100 ) + '%)';
            }
            currentIndex = index;
        }

        prevBtn.addEventListener('click', function() { showSlide(currentIndex - 1); });
        nextBtn.addEventListener('click', function() { showSlide(currentIndex + 1); });

        document.addEventListener('keydown', function(e) {
            if ( e.key === 'ArrowLeft' ) { showSlide(currentIndex - 1); }
            else if ( e.key === 'ArrowRight' ) { showSlide(currentIndex + 1); }
        });

        var touchstartX = 0, touchendX = 0;
        slider.addEventListener('touchstart', function(e) {
            touchstartX = e.changedTouches[0].screenX;
        });
        slider.addEventListener('touchend', function(e) {
            touchendX = e.changedTouches[0].screenX;
            if ( touchendX < touchstartX - 50 ) { showSlide(currentIndex + 1); }
            if ( touchendX > touchstartX + 50 ) { showSlide(currentIndex - 1); }
        });

        if ( autoScroll ) {
            setInterval(function() {
                showSlide(currentIndex + 1);
            }, 5000);
        }
    }
} );
