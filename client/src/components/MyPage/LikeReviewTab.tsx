import { useEffect, useState, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { getUserReview } from '../../util/apiCollection';
import ReviewTabPagenation from './ReviewTabPagenation';
import { loginRefresh } from '../../util/loginRefresh';

interface ReviewType {
  id: number;
  type: string;
  title: string;
  content: string;
  recommendNumber: number;
  createdAt: string;
  modifiedAt: string;
  productId: number;
  productName: string;
  writerNickname: string;
  writerImage: string;
}

const LikeReviewTab = () => {
  const [reviewData, setReviewData] = useState<any[]>();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdate, setIsUpdate] = useState(true);

  const params = `?page=${currentPage}&size=5&sort=createdAt`;
  const DetailReviewData = async () => {
    const data: any = await getUserReview('recommends', params);
    switch (data.status) {
      case 200:
        setReviewData(data?.data.reviews.content);
        setTotalPages(data?.data.reviews.totalPages);
        break;
      case 412:
        loginRefresh();
        DetailReviewData();
        break;
      default:
    }
  };

  useEffect(() => {
    DetailReviewData();
    setIsUpdate(false);
  }, [isUpdate]);

  const onClickPage = (
    target: SetStateAction<string> | SetStateAction<number>
  ) => {
    if (target === 'Prev') {
      setCurrentPage(currentPage - 1);
    } else if (target === 'Next') {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(+target);
    }
    setIsUpdate(true);
  };

  return (
    <>
      {!reviewData || reviewData?.length === 0 ? (
        <div className="flex flex-col justify-center w-full max-w-screen-lg p-5 px-24 mt-20">
          <div className="mb-2 text-xl text-center">
            좋아요한 리뷰가 없습니다
          </div>
        </div>
      ) : (
        <>
          {reviewData?.map((el: ReviewType, index: number) => {
            return (
              <>
                <Link
                  to={`/review/${el.id}`}
                  key={index}
                  className="flex flex-col justify-center w-full max-w-screen-lg py-2.5 lg:px-24 px-10"
                >
                  <div className="mb-2 text-xl">{el.title}</div>
                  <div className="mb-2 overflow-hidden text-ellipsis line-clamp-2">
                    {el.content.replace(/"/g, '').replace(/<[^>]*>?/g, '')}
                  </div>
                  <div className="flex text-sm">
                    <div className="px-3 py-0.5 bg-slate-300 rounded-lg  dark:bg-DMSubColor">
                      {el.type}
                    </div>
                    <div className="px-3 py-0.5  hidden sm:block">
                      {el.productName}
                    </div>
                    <div className="ml-auto text-slate-600 dark:text-gray-400">
                      {new Date(el.createdAt).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </div>
                  </div>
                </Link>
              </>
            );
          })}
          {totalPages > 1 ? (
            <ReviewTabPagenation
              currentPage={currentPage}
              totalPages={totalPages}
              onClickPage={onClickPage}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default LikeReviewTab;
