import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import './App.css';

const UrlForm = () => {
  const [urls, setUrls] = useState(['', '', '']);
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleChange = (index, event) => {
    const newUrls = [...urls];
    newUrls[index] = event.target.value;
    setUrls(newUrls);
  };

  const addField = () => {
    if (urls.length < 10) {
      setUrls([...urls, '']);
    }
  };

  const removeField = (index) => {
    if (urls.length > 3) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://vercel-dep-server-side.vercel.app/fetch-metadata', { urls });
      setMetadata(response.data);
    } catch (err) {
      setError('Failed to fetch metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (url) => {
    window.open(url, '_blank');
  };

  const fadeIn = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(20px)' : 'translateY(0px)',
    config: { duration: 300 },
  });

  return (
    <div className="url-form">
      <div className="header-container">
        <h1>Dynamic URL Metadata Fetcher</h1>
        <button
          className={`dark-mode-toggle ${darkMode ? 'dark-mode' : ''}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <span className="emoji">{darkMode ? '🌙' : '☀️'}</span>
          {darkMode ? ' Light Mode' : ' Dark Mode'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <div key={index} className="input-group">
            <input
              type="url"
              placeholder={`Enter URL ${index + 1}`}
              value={url}
              onChange={(e) => handleChange(index, e)}
              required
            />
            {urls.length > 3 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeField(index)}
              >
                del
              </button>
            )}
          </div>
        ))}
        <div className="button-container">
          <button type="button" className="button add-button" onClick={addField}>
            Add URL
          </button>
          <button type="submit" className="button fetch-button" disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Metadata'}
          </button>
        </div>
      </form>

      {loading && <div className="spinner"></div>}
      {error && <p className="error">{error}</p>}

      <animated.div style={fadeIn} className="metadata-container">
        {metadata.map((item, index) => (
          <animated.div
            key={index}
            className="metadata-item"
            style={{
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`,
            }}
            onClick={() => handleClick(item.url)}
          >
            <h2>{item.title || 'No title found'}</h2>
            <p>{item.description || 'No description found'}</p>
            {item.image && item.image !== 'No image found' && (
              <img src={item.image} alt="metadata" />
            )}
            {item.error && <p>{item.error}</p>}
          </animated.div>
        ))}
      </animated.div>
    </div>
  );
};

export default UrlForm;
