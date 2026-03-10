const AccentLine = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 4"
      fill="none"
      className={`mt-1 block h-0.5 w-[7ch] max-w-full group-[.text-center]/heading:mx-auto group-[.text-right]/heading:ml-auto ${className} text-accent`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="0"
        y1="2"
        x2="120"
        y2="2"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AccentLine;
