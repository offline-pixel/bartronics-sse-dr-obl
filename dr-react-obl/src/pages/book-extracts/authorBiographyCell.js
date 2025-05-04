import React, { useState } from 'react';
import sanitizeHTML from '../../utils/htmlSanitizer';

const AuthorBiographyCell = ({ value }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // we will need this inside list-view only
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`biography-cell ${isExpanded ? 'expanded' : ''}`}>
      <div
        className={`biography-content ${isExpanded ? 'expanded' : ''}`}
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(value) }}
      />
      {/* <a href className="read-toggle-button grid-view-hidden" onClick={toggleExpansion}>
        {isExpanded ? 'Read Less' : 'Read More'}
      </a> */}
    </div>
  );
};

export default AuthorBiographyCell;