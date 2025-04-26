import React from 'react';

const UserRatings = ({ ratings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="ratings-container loading">
        <div className="loading-spinner"></div>
        <p>Loading ratings...</p>
      </div>
    );
  }

  if (!ratings || !ratings.ratings || ratings.ratings.length === 0) {
    return (
      <div className="ratings-container empty">
        <p>No ratings yet.</p>
      </div>
    );
  }

  // Sort ratings by date (newest first)
  const sortedRatings = [...ratings.ratings].sort((a, b) => {
    return new Date(b.ratedAt) - new Date(a.ratedAt);
  });

  return (
    <div className="ratings-container">
      <div className="ratings-summary">
        <div className="average-rating">
          <div className="rating-number">{ratings.averageRating.toFixed(1)}</div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`star ${star <= Math.round(ratings.averageRating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="total-ratings">{ratings.totalRatings} {ratings.totalRatings === 1 ? 'rating' : 'ratings'}</div>
        </div>
      </div>

      <div className="ratings-list">
        {sortedRatings.map((rating, index) => (
          <div key={index} className="rating-item">
            <div className="rating-header">
              <div className="rating-skill">{rating.skillName}</div>
              <div className="rating-date">{new Date(rating.ratedAt).toLocaleDateString()}</div>
            </div>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${star <= rating.rating ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            {rating.feedback && (
              <div className="rating-feedback">"{rating.feedback}"</div>
            )}
          </div>
        ))}
      </div>

      <style jsx="true">{`
        .ratings-container {
          background: #252525;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }

        .ratings-container.loading,
        .ratings-container.empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 150px;
          color: #999;
        }

        .loading-spinner {
          border: 3px solid #333;
          border-radius: 50%;
          border-top: 3px solid var(--primary);
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .ratings-summary {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .average-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rating-number {
          font-size: 48px;
          font-weight: bold;
          color: var(--primary);
        }

        .rating-stars {
          display: flex;
          margin: 5px 0;
        }

        .star {
          font-size: 18px;
          color: #555;
          margin: 0 2px;
        }

        .star.filled {
          color: var(--primary);
        }

        .total-ratings {
          color: #999;
          font-size: 14px;
        }

        .ratings-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .rating-item {
          padding: 15px;
          background: #333;
          border-radius: 6px;
        }

        .rating-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .rating-skill {
          font-weight: 500;
          color: #fff;
        }

        .rating-date {
          color: #999;
          font-size: 14px;
        }

        .rating-feedback {
          margin-top: 10px;
          font-style: italic;
          color: #ccc;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default UserRatings;
