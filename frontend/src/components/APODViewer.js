import { useState, useEffect } from "react";
import "./styles.css";

function APODViewer() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    fetch("https://stellarpic.onrender.com")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("APOD data received:", data); // Debug log
        setApod(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching APOD:", error);
        setError("Failed to load the astronomy picture. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Handle image load success
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageLoaded(true);
  };

  // Handle image load error
  const handleImageError = () => {
    console.error("Image failed to load");
    setImageLoaded(false);
  };

  return (
    <div className="apod-container">
      {loading ? (
        <div className="loading">
          <p>Loading today's astronomy content...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : apod ? (
        <>
          <h1>{apod.title}</h1>
          <p className="date">{apod.date}</p>

          <div className="media-container">
            {apod.media_type === "image" ? (
              <img 
                src={apod.hdurl || apod.url} 
                alt={apod.title} 
                className="apod-image"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : apod.media_type === "video" ? (
              <div className="video-wrapper">
                <div className="video-thumbnail-container">
                  {/* For YouTube videos, create a thumbnail */}
                  {apod.url.includes("youtube") && (
                    <img
                      src={`https://img.youtube.com/vi/${apod.url.split('v=')[1]?.split('&')[0] || apod.url.split('/').pop()}/hqdefault.jpg`}
                      alt={`Thumbnail for ${apod.title}`}
                      className="video-thumbnail"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  )}
                </div>
                <a 
                  href={apod.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="video-link"
                >
                  Watch Video
                </a>
              </div>
            ) : (
              <p className="unsupported-media">
                This content type ({apod.media_type}) is not supported for direct display.
                <a 
                  href={apod.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on NASA
                </a>
              </p>
            )}
          </div>

          <div className="explanation">
            <p>{apod.explanation}</p>
            {apod.copyright && <p className="copyright">© {apod.copyright}</p>}
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default APODViewer;