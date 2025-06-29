interface ErrorSvgProps extends React.SVGProps<SVGSVGElement> {
  width: number;
  height: number;
  className?: string;
}

export const ErrorSvg: React.FC<ErrorSvgProps> = ({
  width,
  height,
  className,
  ...rest
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M8.00016 5.33333V8M8.00016 10.6667H8.00683M14.6668 8C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8C1.3335 4.3181 4.31826 1.33333 8.00016 1.33333C11.6821 1.33333 14.6668 4.3181 14.6668 8Z"
        stroke="#F04438"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
