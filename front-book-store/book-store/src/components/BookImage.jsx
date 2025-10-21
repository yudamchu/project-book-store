import { useBookImage } from '../hooks/useBookImage';

function BookImage({ bookId, title }) {
  const { getBookImage } = useBookImage();
  const { data: images, isLoading } = getBookImage(bookId);

  if (isLoading) return <div style={{ width: 60, height: 85, background: '#f3f3f3' }}></div>;

    const mainImages = images.filter((img) => img.sortOrder === 1);
    const imgUrl =
    mainImages && mainImages.length > 0
      ? `http://localhost:9090${mainImages[0].imageUrl}`
      : '/images/no_image.png';

  return (
    <img
      src={imgUrl}
      alt={title}
      className="book-img"
      style={{
        width: 60,
        height: 85,
        objectFit: 'cover',
        borderRadius: 8,
        border: '1px solid #eee',
      }}
    />
  );
}

export default BookImage;
