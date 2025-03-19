import React from 'react';

function PhotoGrid() {
  // Add logic here to display photos from the cloud
  return (
    <section className="photo-grid">
      <h2>Recent Photos</h2>
      <div className="grid">
        {/* Example photos */}
        <div className="grid-item">
          <img src="img/photo1.jpg" alt="Photo 1" />
        </div>
        <div className="grid-item">
          <img src="img/photo2.jpg" alt="Photo 2" />
        </div>
        {/* ... */}
      </div>
    </section>
  );
}

export default PhotoGrid;