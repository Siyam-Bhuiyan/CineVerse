import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import RowSkeleton from "@/components/skeletons/RowSkeleton";

export default function Loading() {
  return (
    <div className="space-y-10">
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    </div>
  );
}
