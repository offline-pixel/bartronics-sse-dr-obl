// bookExtractColumns.js
import React from 'react';
import sanitizeHTML from '../../utils/htmlSanitizer';
import { formatDateToMMDDYY } from '../../utils/dateUtils';

export const bookExtractColumns = [
  {
    Header: 'Sequence',
    accessor: 'sequence',
    isSortable: false,
    Cell: ({value}) => {
      return <div className="outer-div position-abs card-tag unset-bottom unset-right">{value}</div>;
    },
  },
  {
    Header: 'Cover',
    accessor: 'jacketUrl',
    Cell: ({ row }) => {
      const { jacketUrl, isbn } = row.original;

      // Define a fallback image source - BAD PRACTICE
      // const fallbackImageSrc = 'your-fallback-image-url.jpg';
      // // Function to handle image load errors
      // const handleImageError = (e) => {
      //   // this will be an infinite loop if fallback image will not be found
      //   e.target.src = fallbackImageSrc; // Set the fallback image source on error
      // };
      // Check if jacketUrl is undefined or empty
      if (!jacketUrl) {
        return (
          <div className="outer-div top-pad10 left-pad10">
            <div className="image-not-found">
              404 Image 
            </div>
          </div>
        );
      }

      return (
        <div className="outer-div top-pad10 left-pad10">
          <a href={`https://extracts.panmacmillan.com/extract?isbn=${isbn}`} target="_blank" rel="noopener noreferrer">
            <img
              src={jacketUrl}
              alt="Book Cover"
              // onError={handleImageError}
            />
          </a>
        </div>
      );
    },
    isSortable: false
  },
  {
    Header: 'Author',
    accessor: 'author',
    Cell: ({value}) => {
      return <div className="outer-div"><b> <i>{value}</i> </b> </div>;
    },
    isSortable: true
  },
  {
    Header: 'Biography',
    accessor: 'authorBiography',
    Cell: ({ value }) => (
      <div className="outer-div">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(value) }} />
      </div>
    ),
    isSortable: true
  },
  {
    Header: 'Title',
    accessor: 'title',
    Cell: ({ row }) => {
      return (
      <div className="outer-div">
          <a className='txt-left' href={`https://extracts.panmacmillan.com/extract?isbn=${row.original.isbn}`} target="_blank" rel="noopener noreferrer">
            {row.original.title}
          </a>
        </div>
      );
    },
    isSortable: true
  },
  {
    Header: 'Reading Time (minutes)',
    accessor: 'estimatedReadingTimeMinutes',
    Cell: ({ value }) => {
      let iconClass = '';
  
      if (value < 10) {
        iconClass = 'text-green';
      } else if (value > 20) {
        iconClass = 'text-red';
      } else {
        iconClass = 'text-yellow';
      }
  
      return (
        <div className="outer-div">
          <span className="list-view-hidden">Reading Time: </span>
          <i className={`Orbitron ${iconClass}`}>{value}</i>
        </div>
      );
    },
    isSortable: true,
  },
  {
    Header: 'Publication Date',
    accessor: 'publicationDate',
    Cell: ({ value }) => {
      const formattedDate = formatDateToMMDDYY(value);
      return <div className="outer-div"><span className="list-view-hidden">Publication Date:</span> <i>{formattedDate}</i></div>
    },
    isSortable: true
  }
];
