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
import moment from 'moment/moment';
import 'moment/locale/vi';  

const ReviewsSection = ({ productId, userId }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
 
  moment.locale('vi');

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => ProductService.getProductReviews(productId),
  });

  const hideReviewMutation = useMutation({
    mutationFn: ({ reviewId }) =>
      ProductService.hideProductReview(productId, reviewId, user.accessToken),
    onSuccess: () => {
      notification.success({ message: 'Đã ẩn bình luận thành công!' });
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
      notification.success({ message: 'Bình luận đã được khôi phục thành công!' });
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
              description: 'Bình luận của bạn đã được thêm thành công!',
            });
            setIsReviewing(false);
            queryClient.invalidateQueries(['product-reviews', productId]);
          }
        })
        .catch((error) => {
          console.error('Error adding review:', error);
          notification.error({
            message: 'Error',
            description: 'Bạn không thể thực hiện bình luận',
          });
        });
    } else {
      notification.warning({
        message: 'Incomplete Review',
        description: 'Vui lòng cung cấp cả đánh giá và bình luận.',
      });
    }
  };


  const [currentPage, setCurrentPage] = useState(1);  
  const commentsPerPage = 10;

  if (isLoading) return <div>Loading...</div>;

  const totalReviews = reviewsData?.data.length || 0;
  const currentReviews = reviewsData?.data.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const sortedReviews = reviewsData?.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Container>
      <Header>Customer Reviews</Header>
      <List
        itemLayout="horizontal"
        dataSource={sortedReviews}
        renderItem={(review) => (
          <ReviewItem>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{review.name.charAt(0)}</Avatar>}
                title={
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong>{review.name}</strong>
                      <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', marginLeft: '8px' }}>
                        {moment(review.createdAt).fromNow()}
                      </div>
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
        pagination={{
          current: currentPage,
          pageSize: commentsPerPage,
          total: totalReviews,
          onChange: onPageChange,
        }}
      />
      {reviewsData?.data?.length === 0 && <NoReviewsMessage>Hãy mua hàng để trở thành người đánh giá sản phẩm đầu tiên!</NoReviewsMessage>}
      {!user?.id ? (
        <p style={{ color: 'red', textAlign: 'center' }}>
          Vui lòng đăng nhập để có thể đánh giá sản phẩm.
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
