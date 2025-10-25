export default function MissionCardSkeleton() {
  return (
    <div className="h-fit bg-gradient-to-r from-[#0E0E0E] to-[#0F060F] sm:h-[382.25px] w-full grid gap-5 sm:grid-cols-2 rounded-[20px] p-4 sm:p-6 md:p-8 animate-pulse">
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-0 justify-between order-2 sm:order-1">
        <div>
          {/* Title skeleton */}
          <div className="h-8 sm:h-10 bg-gray-700 rounded-md mb-4 w-3/4"></div>

          {/* Instructor skeleton */}
          <div className="h-4 bg-gray-700 rounded-md mb-2 w-1/2"></div>

          {/* Description skeleton */}
          <div className="h-3 bg-gray-700 rounded-md mb-1 w-full"></div>
          <div className="h-3 bg-gray-700 rounded-md mb-3 w-5/6"></div>

          {/* Category and rating skeleton */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-6 bg-gray-700 rounded-md w-20"></div>
            <div className="h-6 bg-gray-700 rounded-md w-16"></div>
          </div>

          {/* Levels and Duration skeleton */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-4 bg-gray-700 rounded-md w-24"></div>
            <div className="h-4 bg-gray-700 rounded-md w-32"></div>
          </div>

          {/* Price skeleton */}
          <div className="h-5 bg-gray-700 rounded-md mb-2 w-20"></div>
        </div>

        {/* Progress bar skeleton */}
        <div className="w-full flex items-center gap-2">
          <div className="flex items-center flex-1">
            <div className="flex-1 h-[5px] bg-gray-700 rounded-[5px]"></div>
            <div className="h-4 bg-gray-700 rounded-md ml-2 w-20"></div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="w-full xl:w-[234.64px] h-[48px] sm:h-[56.4px] bg-gray-700 rounded-[30px]"></div>
      </div>

      {/* Image skeleton */}
      <div className="bg-gray-700 h-[180px] sm:h-[20vh] order-1 w-full sm:order-2 sm:h-full rounded-[10px]"></div>
    </div>
  );
}

