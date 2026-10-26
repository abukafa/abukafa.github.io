
  $(function () {

    // MENU
    $('.navbar-nav .nav-link').on('click', function () {
      $(".navbar-collapse").collapse('hide');
    });


    // AOS ANIMATION
    AOS.init({
      disable: 'mobile',
      duration: 800,
      anchorPlacement: 'center-bottom'
    });


    // SMOOTH SCROLL
    $('.navbar-nav .nav-link').on('click', function (event) {
      var $anchor = $(this);
      var target = $anchor.attr('href');
      if (target && target.startsWith('#')) {
        var $targetEl = $(target);
        if ($targetEl.length) {
          $('html, body').stop().animate({
            scrollTop: $targetEl.offset().top - 0
          }, 1000);
          event.preventDefault();
        }
      }
    });


    // PROJECT SLIDES (DUAL PILLARS)
    function setupCarousel($carousel) {
      if (!$carousel.length) return;
      if ($carousel.hasClass('owl-loaded')) {
        $carousel.trigger('refresh.owl.carousel');
        return;
      }
      $carousel.owlCarousel({
        loop: true,
        center: true,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplaySpeed: 800,
        smartSpeed: 800,
        autoplayHoverPause: true,
        slideBy: 1,
        margin: 30,
        checkVisible: false,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
          },
          768: {
            items: 2,
          }
        }
      });

      // Recalculate dimensions once layout settles
      setTimeout(function () {
        $carousel.trigger('refresh.owl.carousel');
      }, 100);
    }

    // URL-BASED CONDITIONAL TAB RENDERING
    function getPillarFromUrl() {
      try {
        var urlParams = new URLSearchParams(window.location.search);
        var pillar = urlParams.get('pillar') || urlParams.get('tab');

        if (!pillar && window.location.hash) {
          var hash = window.location.hash.toLowerCase();
          if (hash.indexOf('growth') !== -1 || hash.indexOf('marketing') !== -1 || hash.indexOf('pillar-2') !== -1 || hash.indexOf('pillar2') !== -1) {
            return { pillar: 'growth', scroll: true };
          }
          if (hash.indexOf('engineering') !== -1 || hash.indexOf('pillar-1') !== -1 || hash.indexOf('pillar1') !== -1) {
            return { pillar: 'engineering', scroll: true };
          }
          if (hash.indexOf('?') !== -1) {
            var hashQuery = new URLSearchParams(hash.split('?')[1]);
            var hashPillar = hashQuery.get('pillar') || hashQuery.get('tab');
            if (hashPillar) return { pillar: hashPillar.toLowerCase(), scroll: true };
          }
        }

        if (pillar) {
          return { pillar: pillar.toLowerCase(), scroll: false };
        }
      } catch (err) {
        console.warn('URL parsing error:', err);
      }
      return null;
    }

    function syncPillarTabFromUrl() {
      var pillarInfo = getPillarFromUrl();
      if (!pillarInfo) return;

      var isGrowth = (pillarInfo.pillar === 'growth' || pillarInfo.pillar === '2' || pillarInfo.pillar === 'marketing' || pillarInfo.pillar === 'operations');
      var targetBtn = isGrowth ? '#tab-growth-btn' : '#tab-engineering-btn';
      var $btn = $(targetBtn);

      if ($btn.length && !$btn.hasClass('active')) {
        $btn.tab('show');
      } else {
        var targetPane = isGrowth ? '#tab-growth' : '#tab-engineering';
        setupCarousel($(targetPane).find('.owl-carousel'));
      }

      if (pillarInfo.scroll) {
        setTimeout(function () {
          var $targetSection = $('#project');
          if ($targetSection.length) {
            $('html, body').stop().animate({
              scrollTop: $targetSection.offset().top - 20
            }, 800);
          }
        }, 300);
      }
    }

    // Expose for external calls
    window.setupCarousel = setupCarousel;
    window.syncPillarTabFromUrl = syncPillarTabFromUrl;

    // Check URL state on initial page load
    var initialPillar = getPillarFromUrl();
    if (initialPillar && (initialPillar.pillar === 'growth' || initialPillar.pillar === '2' || initialPillar.pillar === 'marketing' || initialPillar.pillar === 'operations')) {
      $('#tab-growth-btn').tab('show');
    } else {
      setupCarousel($('#project-slide-engineering'));
    }

    // Scroll if needed when loaded with hash anchor
    if (initialPillar && initialPillar.scroll) {
      setTimeout(function () {
        var $targetSection = $('#project');
        if ($targetSection.length) {
          $('html, body').stop().animate({
            scrollTop: $targetSection.offset().top - 20
          }, 800);
        }
      }, 300);
    }

    // Handle tab switch & sync URL query param without reload
    $('a[data-toggle="pill"], .pillar-tab-btn').on('shown.bs.tab', function (e) {
      var targetPane = $($(e.target).attr('href'));
      var $targetCarousel = targetPane.find('.owl-carousel');
      setupCarousel($targetCarousel);
      setTimeout(function () {
        $targetCarousel.trigger('refresh.owl.carousel');
      }, 50);

      // Update URL query param seamlessly
      var isGrowth = targetPane.is('#tab-growth');
      var pillarParam = isGrowth ? 'growth' : 'engineering';
      if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('pillar', pillarParam);
        window.history.replaceState(null, '', url.toString());
      }

      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });

    // Listen to browser Back/Forward & hash changes
    window.addEventListener('popstate', syncPillarTabFromUrl);
    window.addEventListener('hashchange', syncPillarTabFromUrl);

    // Refresh carousels once images/window are fully loaded
    $(window).on('load', function () {
      $('.owl-carousel').trigger('refresh.owl.carousel');
    });

  });


    

