import { Suspense } from "react";
import MissionsContent from "./MissionsContent";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-full gap-10 w-full bg-black text-white min-h-screen p-6 items-center justify-center">
          <LoadingSpinner size="xlarge" color="mutant" />
        </div>
      }
    >
      <MissionsContent />
    </Suspense>
  );
}
