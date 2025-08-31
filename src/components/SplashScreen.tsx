import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onLoadComplete: () => void;
}

// Video URLs that need preloading
const videoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/Outworking%20everyone%20isn%E2%80%99t%20that%20hard%20v1.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/What%20is%20the%20most%20normal%20episode%20of%20Family%20Guy%20v3.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/Never%20running%20out%20of%20things%20to%20say%20is%20easy%2C%20actually%20isn%27t%C2%A0that%C2%A0hard%20v1.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/sample1_V1.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/The%20entire%20history%20of%20Thomas%20Shelby%20v2_1.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/WOLF%27S%20LAIR%20WHAT%20AI%20FOUND%20IN%20THIS%20HIDDEN%20NAZI%20BUNKER%20FROM%20WORLD%20WAR%20II%20IS%20TERRIFYING.mp4",
  "https://ia800906.us.archive.org/16/items/flirting-with-women-isnt-that-hard-v-1/Flirting%20with%20women%20isn%27t%20that%20hard%20v1.mp4",
  "https://ia600904.us.archive.org/35/items/portfolio_202508/Young%20Actresses%20Who%20Tragically%20Passed%20Away.mp4",
  "https://ia601002.us.archive.org/33/items/sample-1-1/sample1%20%281%29.mp4",
  "https://ia801704.us.archive.org/11/items/inkuuuu/inkuuuu.mp4",
  "https://ia600902.us.archive.org/33/items/part-1-shorts/Inklwell%20media%20reel%201%20v3.mp4",
  "https://ia801002.us.archive.org/18/items/shorts-2-part/Mj%20real_2.mp4",
  "https://ia801007.us.archive.org/2/items/inkwell-media-video-1-v-2/inkwell%20media%20video%201%20v2.mp4",
  "https://ia600902.us.archive.org/33/items/part-1-shorts/Inkwell%20media%20v2%20FINAL.mp4",
  "https://ia600902.us.archive.org/33/items/part-1-shorts/Inkwell%20Media%20ki%20videooo.mp4",
  "https://ia801002.us.archive.org/18/items/shorts-2-part/mj%20realtyyyyy2.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
];
export function SplashScreen({ onLoadComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('LOADING');
  const [thumbnailsGenerated, setThumbnailsGenerated] = useState(0);

  useEffect(() => {
    const loadingTexts = ['LOADING', 'PREPARING', 'GENERATING', 'OPTIMIZING', 'CRAFTING', 'BUILDING'];
    let textIndex = 0;
    
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[textIndex]);
    }, 400);

    // Generate video thumbnails
    const generateThumbnails = async () => {
      const videoPromises = videoUrls.map((url, index) => {
        return new Promise<void>((resolve) => {
          const video = document.createElement('video');
          video.preload = 'none';
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.volume = 0;
          
          const handleLoad = () => {
            // Seek to 1 second for thumbnail
            video.currentTime = 1;
          };
          
          const handleSeeked = () => {
            setThumbnailsGenerated(prev => prev + 1);
            cleanup();
            resolve();
          };
          
          const handleError = () => {
            console.warn(`Failed to generate thumbnail for: ${url}`);
            setThumbnailsGenerated(prev => prev + 1);
            cleanup();
            resolve();
          };
          
          const cleanup = () => {
            video.removeEventListener('loadeddata', handleLoad);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('error', handleError);
            video.remove();
          };
          
          video.addEventListener('loadeddata', handleLoad);
          video.addEventListener('seeked', handleSeeked);
          video.addEventListener('error', handleError);
          
          // Shorter timeout for thumbnail generation
          setTimeout(() => {
            if (video.readyState < 2) {
              handleError();
            }
          }, 1500);
          
          video.src = url;
          video.load();
        });
      });
      
      // Wait for all thumbnails to generate or timeout
      await Promise.all(videoPromises);
    };

    // Start thumbnail generation
    generateThumbnails();
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const thumbnailProgress = (thumbnailsGenerated / videoUrls.length) * 70; // Thumbnails contribute 70% of progress
        const baseProgress = Math.min(prev + Math.random() * 12 + 3, 30); // Base loading contributes 30%
        const totalProgress = Math.min(baseProgress + thumbnailProgress, 100);
        
        if (totalProgress >= 100 && thumbnailsGenerated >= videoUrls.length * 0.7) { // Allow completion when 70% of thumbnails are generated
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => onLoadComplete(), 500);
          return 100;
        }
        return totalProgress;
      });
    }, 150);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onLoadComplete, thumbnailsGenerated]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
  
   

      <div className="text-center z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bosenAlt text-white tracking-tight mb-4">
            AAMIR NAQVI
          </h1>
          <p className="text-white/60 font-bosenAlt text-sm tracking-wide">
            VISUAL STORYTELLER
          </p>
        </div>

        <div className="mb-8">
          <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 font-bosenAlt text-xs mt-4 tracking-widest">
            {loadingText}... {Math.round(progress)}%
          </p>
          <p className="text-white/40 font-bosenAlt text-xs mt-1 tracking-wide">
            THUMBNAILS: {thumbnailsGenerated}/{videoUrls.length}
          </p>
        </div>

        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}