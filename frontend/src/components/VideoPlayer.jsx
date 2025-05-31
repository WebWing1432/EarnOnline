import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = loadPlayer;
      document.body.appendChild(tag);
    } else {
      loadPlayer();
    }

    function loadPlayer() {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId,
        events: {
          onStateChange: (event) => {
            if (event.data === 1) console.log('Playing...');
            if (event.data === 2) console.log('Paused');
            if (event.data === 0) console.log('Ended');
          }
        }
      });
    }
  }, [videoId]);

  return <div id="yt-player" />;
};

export default VideoPlayer;
