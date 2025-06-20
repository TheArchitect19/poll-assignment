"use client";

import ResultsPage from "@/app/components/result/ResultPage";
import { Suspense } from "react";


export default function Page() {

  return (
    <Suspense>
      <ResultsPage />
    </Suspense>
  );
}
