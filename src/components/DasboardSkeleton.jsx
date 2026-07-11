import { useEffect, useState } from "react";

function useElapsedTime() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      setElapsedMs(performance.now() - startTime);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (elapsedMs / 1000).toFixed(1);
}

function Block({ className = "" }) {
  return <div className={`bg-black/10 ${className}`} />;
}

function PulseCard({ className = "", children }) {
  return (
    <div
      className={`animate-pulse border-2 border-black bg-white ${className}`}
      style={{ animationDuration: "1.4s" }}
    >
      {children}
    </div>
  );
}

function ElapsedTag({ seconds }) {
  return (
    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/30">
      Fetching · {seconds}s
    </span>
  );
}

export default function DashboardSkeleton() {
  const seconds = useElapsedTime();

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="lg:hidden">
        <div className="mb-4 flex justify-end">
          <ElapsedTag seconds={seconds} />
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4">
          <PulseCard className="p-6">
            <Block className="mb-3 h-3 w-24" />
            <Block className="h-10 w-40" />
          </PulseCard>
          <div className="grid grid-cols-2 gap-4">
            <PulseCard className="p-6">
              <Block className="mb-3 h-3 w-20" />
              <Block className="h-9 w-14" />
            </PulseCard>
            <PulseCard className="p-6">
              <Block className="mb-3 h-3 w-16" />
              <Block className="h-9 w-14" />
            </PulseCard>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <Block className="h-7 w-40" />
            <Block className="h-4 w-16" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <PulseCard key={i} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Block className="mb-2 h-3 w-16" />
                  <Block className="h-5 w-32" />
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Block className="h-4 w-14" />
                  <Block className="h-4 w-12" />
                </div>
              </PulseCard>
            ))}
          </div>
        </section>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="mx-auto hidden max-w-[1440px] px-12 py-12 lg:block">
        <section className="mb-16">
          <div className="mb-8 flex items-baseline justify-between">
            <Block className="h-11 w-96" />
            <ElapsedTag seconds={seconds} />
          </div>

          <div className="grid grid-cols-3 border-2 border-black animate-pulse" style={{ animationDuration: "1.4s" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`p-10 ${i < 2 ? "border-r-2 border-black" : ""}`}>
                <Block className="mb-4 h-3 w-28" />
                <Block className="mb-4 h-14 w-40" />
                <Block className="h-4 w-48" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-between">
            <Block className="h-9 w-56" />
            <Block className="h-4 w-16" />
          </div>

          <div
            className="overflow-hidden border-2 border-black bg-white animate-pulse"
            style={{ animationDuration: "1.4s" }}
          >
            <table className="w-full border-collapse text-left">
              <thead className="bg-black text-white">
                <tr>
                  {["Order ID", "Customer", "Date", "Status", "Amount"].map((label) => (
                    <th key={label} className="px-8 py-6 text-xs font-black uppercase tracking-widest">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Block className="h-4 w-20" /></td>
                    <td className="px-8 py-6">
                      <Block className="mb-2 h-4 w-32" />
                      <Block className="h-3 w-40" />
                    </td>
                    <td className="px-8 py-6"><Block className="h-4 w-24" /></td>
                    <td className="px-8 py-6"><Block className="h-5 w-20" /></td>
                    <td className="px-8 py-6"><Block className="ml-auto h-4 w-16" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}