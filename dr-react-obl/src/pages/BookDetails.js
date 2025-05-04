import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/config';
import sanitizeHTML from '../utils/htmlSanitizer';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import '../app/scss/BookDetails.scss'; // Create this new SCSS file

const BookDetails = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${isbn}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  useEffect(() => {
    const handleScroll = () => {
        if (headingRef.current) {
          const element = headingRef.current;
          const rect = element.getBoundingClientRect();
      
          const windowHeight = window.innerHeight;
          const elementHeight = rect.height;
      
          // Get how much of the element is visible (from bottom up)
          const visibleAmount = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
          const visibilityRatio = visibleAmount / elementHeight;
      
          if (visibilityRatio > 0) {
            const translateX = `${(1 - visibilityRatio) * 100}%`;
            element.style.transform = `translateX(${translateX})`;
          } else {
            element.style.transform = 'translateX(100%)';
          }
        }
      };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!book) return <div className="error-message">Book not found</div>;

  return (
    <div className="book-details-container">
      {/* Header with back button and like icon */}
      <div className="book-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <button 
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={() => setLiked(!liked)}
        >
          <FaHeart />
        </button>
      </div>

      {/* Book Info Section */}
      <div className="book-info-section">
        <div className="book-cover-container">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">by {book.author}</h2>
          <img 
            src={book.jacketUrl} 
            alt={`Cover of ${book.title}`} 
            className="book-cover"
          />
          <br />
          <br />
        </div>
        
        <div className="book-meta">          
          
          <div className="author-biography">
            <h3>About the Author</h3>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(book.authorBiography) }} />
          </div>
          <div className="book-tags">
            <span className="genre-tag">{book.genre}</span>
            <span className="format-tag">{book.formatDescription}</span>
          </div>
        </div>
      </div>

      {/* Book Extract Section */}
      {book.extractHtml && (
        <div className="book-extract-section">
          <h3>Book Extract</h3>
          <div 
            className="book-extract-content" 
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(book.extractHtml) }}
          />
        </div>
      )}

      {/* Related Works Section */}
      {book.relatedWorks?.length > 0 && (
        <div className="related-works-section">
          <h3 className="related-works-heading">Related Works</h3>
          <div ref={headingRef} className="related-works-container">
            {book.relatedWorks.map(work => (
              <div key={work.isbn} className="related-work">
                <img src={work.jacketUrl} alt={work.title} />
                <p>{work.formatDescription}</p>
                {/* <small>{work.publicationDate}</small> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;