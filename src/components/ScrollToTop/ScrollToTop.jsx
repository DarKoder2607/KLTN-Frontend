import { UpOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showButton && (
        <button 
          onClick={scrollToTop} 
          style={styles.button}
        >
          <UpOutlined/>
        </button>
      )}
    </>
  );
};

const styles = {
  button: {
    position: 'fixed',
    bottom: '20px',
    right: '50%',
    transform: 'translateX(50%)',
    padding: '10px 20px',
    fontSize: '20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 1000,
    
  }
};

export default ScrollToTop;
