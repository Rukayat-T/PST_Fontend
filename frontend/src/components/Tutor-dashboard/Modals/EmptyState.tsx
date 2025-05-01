import React from 'react'


type EmptyStateProps = {
    heading?: string;
    subText?: string;
    buttonText?: string;
    icon?: React.ReactNode | React.ReactNode[];
    onClick?: () => void;
  };

function EmptyState({
    heading,
    subText,
    buttonText,
    icon,
    onClick,
  }: EmptyStateProps) {
    return (
        <div className="flex flex-col gap-5 items-center justify-center">
          <div className="w-fit h-fit p-2 rounded-full bg-white shadow-md">
            <svg
              width="54"
              height="53"
              viewBox="0 0 54 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_14_697)">
                <path
                  d="M10 21V45H38V21H10ZM10 17H38V13H10V17ZM40 49H8C7.46957 49 6.96086 48.7893 6.58579 48.4142C6.21071 48.0391 6 47.5304 6 47V11C6 10.4696 6.21071 9.96086 6.58579 9.58579C6.96086 9.21071 7.46957 9 8 9H40C40.5304 9 41.0391 9.21071 41.4142 9.58579C41.7893 9.96086 42 10.4696 42 11V47C42 47.5304 41.7893 48.0391 41.4142 48.4142C41.0391 48.7893 40.5304 49 40 49ZM14 25H22V33H14V25ZM14 37H34V41H14V37ZM26 27H34V31H26V27Z"
                  fill="#959595"
                />
              </g>
              <rect
                x="32.5"
                y="1.5"
                width="19.2231"
                height="19.5447"
                rx="9.61156"
                fill="#F5F5F5"
              />
              <rect
                x="32.5"
                y="1.5"
                width="19.2231"
                height="19.5447"
                rx="9.61156"
                stroke="white"
                strokeWidth="3"
              />
              <path
                d="M42.1116 16.5447C41.2564 16.5414 40.5206 16.331 39.9042 15.9134C39.291 15.4957 38.8187 14.8909 38.4873 14.0987C38.1591 13.3066 37.9967 12.3537 38 11.2401C38 10.1297 38.1641 9.18348 38.4922 8.40128C38.8237 7.61908 39.296 7.02415 39.9091 6.61648C40.5256 6.20549 41.2598 6 42.1116 6C42.9634 6 43.6958 6.20549 44.309 6.61648C44.9255 7.02746 45.3994 7.62405 45.7309 8.40625C46.0623 9.18513 46.2264 10.1297 46.2231 11.2401C46.2231 12.357 46.0573 13.3116 45.7259 14.1037C45.3978 14.8958 44.9271 15.5007 44.314 15.9183C43.7008 16.3359 42.9667 16.5447 42.1116 16.5447ZM42.1116 14.7599C42.6949 14.7599 43.1606 14.4666 43.5086 13.88C43.8566 13.2933 44.0289 12.4134 44.0256 11.2401C44.0256 10.4678 43.9461 9.82481 43.787 9.31108C43.6312 8.79735 43.4091 8.41122 43.1208 8.1527C42.8358 7.89418 42.4993 7.76492 42.1116 7.76492C41.5315 7.76492 41.0675 8.05492 40.7195 8.63494C40.3715 9.21496 40.1958 10.0833 40.1925 11.2401C40.1925 12.0223 40.2704 12.6752 40.4262 13.1989C40.5853 13.7192 40.809 14.1103 41.0974 14.3722C41.3857 14.6307 41.7238 14.7599 42.1116 14.7599Z"
                fill="#0085C8"
              />
              <defs>
                <clipPath id="clip0_14_697">
                  <rect
                    width="48"
                    height="48"
                    fill="white"
                    transform="translate(0 5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <p className="text-xl font-bold">{heading}</p>
          <p className=" text-mid-grey">{subText}</p>
          {/* <Button
            type="fit"
            text={buttonText}
            onClick={onClick}
            className="font-semibold"
            icon={icon ? icon : null}
          /> */}
        </div>
      );
}

export default EmptyState