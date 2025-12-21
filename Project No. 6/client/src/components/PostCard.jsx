import './PostCard.css'
import Button from './Button'

function PostCard({ title, content, author, date, likes = 0, onLike }) {
  const formattedDate = date ? new Date(date).toLocaleDateString() : 'Today'

  return (
    <article className="post-card">
      <div className="post-header">
        <h3 className="post-title">{title}</h3>
        <span className="post-date">{formattedDate}</span>
      </div>
      <p className="post-content">{content}</p>
      <div className="post-footer">
        <div className="post-author">
          <span className="author-label">By:</span>
          <strong>{author}</strong>
        </div>
        <div className="post-actions">
          <Button 
            onClick={onLike} 
            variant="primary"
            disabled={!onLike}
          >
            ❤️ {likes}
          </Button>
        </div>
      </div>
    </article>
  )
}

export default PostCard

