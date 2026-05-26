import Image from "next/image";

type Props = {
  children: React.ReactNode;
  /** Reserve bottom space for fixed tab bar. */
  withTabs?: boolean;
};

export default function PhoneFrame({ children, withTabs = false }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-sky overflow-hidden">
      <div
        className={`relative max-w-[420px] mx-auto min-h-screen px-5 pt-3 ${
          withTabs ? "pb-24" : "pb-6"
        }`}
      >
        {/* Decorative snowdrops behind illustration */}
        <div
          className="pointer-events-none absolute left-0 top-16 z-0"
          style={{ opacity: 0.85 }}
        >
          <Image
            src="/assets/snowdrop-left.png"
            alt=""
            width={120}
            height={260}
            priority
          />
        </div>
        <div
          className="pointer-events-none absolute right-0 top-16 z-0"
          style={{ opacity: 0.85 }}
        >
          <Image
            src="/assets/snowdrop-right.png"
            alt=""
            width={120}
            height={260}
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}
