type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function PaperCard({ children, className = "" }: Props) {
  return (
    <div
      className={`relative bg-paper paper-lines rounded-3xl border-[1.5px] border-ink shadow-[0_2px_0_0_#0F0F0F] ${className}`}
    >
      <div className="dashed-inset" aria-hidden />
      <div className="relative p-5">{children}</div>
    </div>
  );
}
