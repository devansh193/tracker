export const OnlineIndication = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-1 bg-[#00623A] rounded-full animate-ping opacity-75"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="size-[4px] bg-[#00623A] rounded-full animate-ping opacity-50"
            style={{ animationDelay: "200ms" }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="size-4 bg-[#00623A] rounded-full animate-ping opacity-25"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>
        <div className="relative z-10 size-2 bg-[#00623A] rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
