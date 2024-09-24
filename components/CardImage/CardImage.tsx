import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
/* eslint-disable @next/next/no-img-element */
const CardImage = ({
  images,
  iconType,
}: {
  images: any;
  iconType?: string;
}) => {
  return (
    <div className="bg-white w-full h-[27.5vh] rounded-xl mb-5">
      {images?.length !== 0 && images?.length ? (
        <Carousel showThumbs={false} showStatus={false} swipeable>
          {images?.map((image: any, indexImage: number) => (
            <div key={image.content + indexImage} className="flex-col w-full">
              <img
                className="object-cover rounded-xl w-full h-[27.5vh]"
                src={
                  image?.content
                    ? image?.content
                    : "/images/webcolours-unknown.png"
                }
                alt={image?.content}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="w-full h-full">
          <img
            className="object-cover h-full w-full rounded-xl"
            src={
              iconType === "folder"
                ? "/images/icon/folder-mac.png"
                : iconType === "gear"
                ? "/images/icon/gear-icon.png"
                : "/images/webcolours-unknown.png"
            }
            alt={"unknown"}
          />
        </div>
      )}
    </div>
  );
};

export default CardImage;
