import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const visitorData = {
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString()
        };

        // Send tracking data to backend
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/track-visitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitorData),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug('Visitor tracking failed:', error);
      }
    };

    // Track on page load/route change
    trackVisitor();
  }, [location]);

  // Track click events
  useEffect(() => {
    const trackClick = async (event) => {
      try {
        const element = event.target;
        const clickData = {
          element_type: element.tagName.toLowerCase(),
          element_id: element.id || null,
          element_class: element.className || null,
          element_text: element.textContent?.substring(0, 100) || null,
          page_url: window.location.href,
          click_position: {
            x: event.clientX,
            y: event.clientY
          },
          timestamp: new Date().toISOString()
        };

        // Only track meaningful clicks (links, buttons, etc.)
        if (['a', 'button', 'input'].includes(element.tagName.toLowerCase()) || 
            element.getAttribute('role') === 'button' ||
            element.onclick ||
            element.classList.contains('clickable')) {
            
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/track-click`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(clickData),
          });
        }
      } catch (error) {
        console.debug('Click tracking failed:', error);
      }
    };

    // Add click event listener
    document.addEventListener('click', trackClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', trackClick);
    };
  }, []);
};

export default useVisitorTracking;