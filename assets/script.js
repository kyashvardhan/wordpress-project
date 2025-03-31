// Wait until the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with the 'gs-slideshow' class.
    var slideshows = document.querySelectorAll('.gs-slideshow');
    slideshows.forEach(function(container) {
        var siteUrl = container.getAttribute('data-site-url') || 'https://wptavern.com';
        // Build the API URL. We’ll fetch 5 posts.
        var apiUrl = siteUrl.replace(/\/$/, '') + '/wp-json/wp/v2/posts?per_page=5&_embed';
        
        // Check localStorage for cached data.
        var cacheKey = 'gs_cache_' + siteUrl;
        var cached = localStorage.getItem(cacheKey);
        if ( cached ) {
            try {
                var data = JSON.parse(cached);
                // If cache is less than 10 minutes old, use it.
                if ( Date.now() - data.timestamp < 10 * 60 * 1000 ) {
                    buildSlideshow( container, data.posts );
                    return;
                }
            } catch (e) {
                console.error('Cache parse error', e);
            }
        }

        // Fetch data using vanilla JS.
        fetch( apiUrl )
            .then(function( response ) {
                return response.json();
            })
            .then(function( posts ) {
                // Cache the results along with a timestamp.
                localStorage.setItem( cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    posts: posts
                }) );
                buildSlideshow( container, posts );
            })
            .catch(function( error ) {
                console.error( 'Error fetching posts:', error );
                container.innerHTML = '<p>Error loading slideshow.</p>';
            } );
    });

    // Function to build the slideshow.
    function buildSlideshow( container, posts ) {
        if ( !posts || posts.length === 0 ) {
            container.innerHTML = '<p>No posts found.</p>';
            return;
        }

        // Create elements for slideshow container and controls.
        var slider = document.createElement('div');
        slider.className = 'gs-slider';

        posts.forEach(function(post, index) {
            var slide = document.createElement('div');
            slide.className = 'gs-slide';
            slide.style.display = ( index === 0 ) ? 'block' : 'none';

            // Get post data.
            var title = post.title.rendered;
            var link = post.link;
            var date = new Date(post.date).toLocaleDateString();
            // Attempt to get featured image from embedded data.
            var featuredImg = ( post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url ) || '';

            // Build slide content.
            var content = '';
            if ( featuredImg ) {
                content += '<a href="' + link + '" target="_blank"><img src="' + featuredImg + '" alt="' + title + '"></a>';
            }
            content += '<h3><a href="' + link + '" target="_blank">' + title + '</a></h3>';
            content += '<p>' + date + '</p>';
            slide.innerHTML = content;
            slider.appendChild(slide);
        } // end forEach
        );

        // Append slider to container.
        container.innerHTML = '';
        container.appendChild(slider);

        // Add navigation buttons.
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

        // Function to show slide at index.
        function showSlide(index) {
            if ( index < 0 ) { index = slides.length - 1; }
            if ( index >= slides.length ) { index = 0; }
            slides.forEach(function(slide, i) {
                slide.style.display = ( i === index ) ? 'block' : 'none';
            } );
            currentIndex = index;
        }

        // Button event listeners.
        prevBtn.addEventListener('click', function() {
            showSlide(currentIndex - 1);
        });
        nextBtn.addEventListener('click', function() {
            showSlide(currentIndex + 1);
        });

        // Keyboard navigation.
        document.addEventListener('keydown', function(e) {
            if ( e.key === 'ArrowLeft' ) {
                showSlide(currentIndex - 1);
            } else if ( e.key === 'ArrowRight' ) {
                showSlide(currentIndex + 1);
            }
        });

        // Mobile swipe functionality.
        var touchstartX = 0;
        var touchendX = 0;
        slider.addEventListener('touchstart', function(e) {
            touchstartX = e.changedTouches[0].screenX;
        });
        slider.addEventListener('touchend', function(e) {
            touchendX = e.changedTouches[0].screenX;
            handleGesture();
        });
        function handleGesture() {
            if ( touchendX < touchstartX - 50 ) {
                showSlide(currentIndex + 1);
            }
            if ( touchendX > touchstartX + 50 ) {
                showSlide(currentIndex - 1);
            }
        }
    }
} );
