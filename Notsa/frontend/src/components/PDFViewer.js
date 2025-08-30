import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup worker using a reliable CDN link to avoid build issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const API_URL = 'http://localhost:5000';

function PDFViewer({ note, onBackClick }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const fullFileUrl = `${API_URL}${note.fileUrl}`;

  return (
    <div className="pdf-viewer-overlay">
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <h3 className="pdf-title">{note.title}</h3>
          <div className="pdf-controls">
            <a href={fullFileUrl} download className="pdf-action-btn">Download</a>
            <button onClick={onBackClick} className="pdf-action-btn close">Back</button>
          </div>
        </div>
        <div className="pdf-document-wrapper">
          <Document
            file={fullFileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="loading">Loading PDF...</div>}
            error={<div className="error-message">Failed to load PDF file.</div>}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
        {numPages && (
          <div className="pdf-pagination">
            <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
              ‹ Prev
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button type="button" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFViewer;