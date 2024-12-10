import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { List, Avatar, Rate, Button, notification } from 'antd';
import { useState } from 'react';
import * as ProductService from '../../services/ProductService';
import {
  Container,
  Header,
  ReviewForm,
  TextArea,
  SubmitButton,
  NoReviewsMessage,
  ReviewItem,
} from './style';
import { useSelector } from 'react-redux';

const ReviewsSection = ({ productId, userId }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => ProductService.getProductReviews(productId),
  });

  const hideReviewMutation = useMutation({
    mutationFn: ({ reviewId }) =>
      ProductService.hideProductReview(productId, reviewId, user.accessToken),
    onSuccess: () => {
      notification.success({ message: 'Review hidden successfully!' });
      queryClient.invalidateQueries(['product-reviews', productId]);
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Could not hide review.',
      });
    },
  });

  const unhideReviewMutation = useMutation({
    mutationFn: ({ reviewId }) =>
      ProductService.unhideProductReview(productId, reviewId, user.accessToken),
    onSuccess: () => {
      notification.success({ message: 'Review unhidden successfully!' });
      queryClient.invalidateQueries(['product-reviews', productId]);
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Could not unhide review.',
      });
    },
  });

  const handleSubmitReview = () => {
    if (rating && comment) {
      ProductService.addProductReview(productId, { rating, comment, userId }, user.accessToken)
        .then((response) => {
          if (response.status === 'ERR') {
            notification.error({
              message: 'Thông báo',
              description: response.message,
            });
          } else {
            notification.success({
              message: 'Review Added',
              description: 'Your review has been successfully added!',
            });
            setIsReviewing(false);
            queryClient.invalidateQueries(['product-reviews', productId]);
          }
        })
        .catch((error) => {
          console.error('Error adding review:', error);
          notification.error({
            message: 'Error',
            description: 'There was an error while adding your review.',
          });
        });
    } else {
      notification.warning({
        message: 'Incomplete Review',
        description: 'Vui lòng cung cấp cả đánh giá và bình luận.',
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <Header>Customer Reviews</Header>
      <List
        itemLayout="horizontal"
        dataSource={reviewsData?.data}
        renderItem={(review) => (
          <ReviewItem>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{review.name.charAt(0)}</Avatar>}
                title={
                  <div>
                    <div>
                      <strong>{review.name}</strong>
                    </div>
                    <div>
                      <Rate disabled value={review.rating}  />
                    </div>
                  </div>
                  
                }
                description={
                  <div
                    style={{
                      color: review.isHidden ? 'red' : 'inherit',
                      fontStyle: review.isHidden ? 'italic' : 'normal',
                    }}
                  >
                    {review.isHidden ? 'Bình luận đã bị ẩn do vi phạm điều lệ của website.' : review.comment}
                  </div>
                }
              />
              {user?.isAdmin && (
                <div style={{ marginLeft: 'auto' }}>
                  {review.isHidden ? (
                    <Button
                      type="primary"
                      onClick={() => unhideReviewMutation.mutate({ reviewId: review._id })}
                    >
                      Hiện lại
                    </Button>
                  ) : (
                    <Button
                      danger
                      onClick={() => hideReviewMutation.mutate({ reviewId: review._id })}
                    >
                      Ẩn
                    </Button>
                  )}
                </div>
              )}
            </List.Item>
          </ReviewItem>
        )}
      />
      {reviewsData?.data?.length === 0 && <NoReviewsMessage>No reviews yet!</NoReviewsMessage>}
      {!user?.id ? (
        <p style={{ color: 'red', textAlign: 'center' }}>
          Vui lòng đăng nhập để đánh giá sản phẩm.
        </p>
      ) : (
        <>
          <SubmitButton onClick={() => setIsReviewing(true)}>Add Review</SubmitButton>
          {isReviewing && (
            <ReviewForm>
              <Rate onChange={setRating} value={rating} />
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here"
                rows={4}
              />
              <SubmitButton onClick={handleSubmitReview}>Submit Review</SubmitButton>
            </ReviewForm>
          )}
        </>
      )}
    </Container>
  );
};

export default ReviewsSection;
