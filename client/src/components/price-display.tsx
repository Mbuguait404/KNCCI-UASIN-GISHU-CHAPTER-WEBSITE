import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  isMember: boolean | null;
  boothCount: number;
  pricePerBooth: number;
}

export function PriceDisplay({
  isMember,
  boothCount,
  pricePerBooth,
}: PriceDisplayProps) {
  const totalPrice = pricePerBooth * boothCount;

  const isMemberRate = isMember === true;
  const isNonMemberRate = isMember === false;

  return (
    <Card
      className={cn(
        "border-2 transition-colors duration-300",
        isMemberRate && "border-green-500 bg-green-50/30",
        isNonMemberRate && "border-gray-400 bg-gray-50/30",
        !isMember && "border-gray-200"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Price Details
          </CardTitle>
          {isMemberRate && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white">
              Member Rate
            </Badge>
          )}
          {isNonMemberRate && (
            <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white">
              Non-Member Rate
            </Badge>
          )}
          {!isMember && (
            <Badge variant="outline" className="text-gray-500">
              Select membership status
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price per booth */}
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-4xl font-bold",
              isMemberRate && "text-green-600",
              isNonMemberRate && "text-gray-600",
              !isMember && "text-gray-400"
            )}
          >
            KES {pricePerBooth.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">/ booth</span>
        </div>

        {/* Calculation */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              KES {pricePerBooth.toLocaleString()} × {boothCount} booth
              {boothCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-3 border-t-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span
              className={cn(
                "text-2xl font-bold",
                isMemberRate && "text-green-600",
                isNonMemberRate && "text-gray-800",
                !isMember && "text-gray-400"
              )}
            >
              KES {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
