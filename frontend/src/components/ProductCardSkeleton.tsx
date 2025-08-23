// ProductCardSkeleton.tsx
import React from "react";

interface ProductCardSkeletonProps {
  viewMode: "grid" | "list";
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ viewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
        <div className="relative overflow-hidden">
          <div className="w-full h-48 bg-gray-300"></div>
        </div>
        <div className="p-6">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="flex justify-between gap-2">
            <div className="h-10 bg-gray-300 rounded flex-1"></div>
            <div className="h-10 bg-gray-300 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="flex">
        <div className="w-48 h-32 bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1 p-6 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="h-6 bg-gray-300 rounded w-24 mr-3"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-300 rounded w-24"></div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};