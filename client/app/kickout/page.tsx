"use client";

export default function KickedPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white p-8">
      {/* Badge */}
      <span className="bg-gradient-to-r from-[#7765DA] via-[#5767D0] to-[#4F0DCE] text-white text-sm px-4 py-2 rounded-full inline-block mb-4">
        🔴 Intervue Poll
      </span>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">You’ve been Kicked out!</h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-base max-w-md text-center">
        Looks like the teacher had removed you from the poll system. Please try
        again sometime.
      </p>
    </div>
  );
}
