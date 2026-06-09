import { assetPath } from "@/config/site";

type UnderConstructionStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function UnderConstructionState({
  title = "Page Under Development",
  description = "We're working on this page and it will be available in a future",
  className = ""
}: UnderConstructionStateProps) {
  return (
    <div
      className={[
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center",
        "gap-4 px-3 py-6 text-center sm:gap-5 sm:px-5 sm:py-10 md:gap-6 md:px-6 md:py-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={assetPath("/images/page-in-development.svg")}
        alt="Web page wireframe pending design"
        width={360}
        height={260}
        className="h-auto w-[min(72vw,360px)] max-w-full shrink-0 sm:w-[min(64vw,340px)] md:w-[min(52vw,360px)]"
      />
      <div className="w-full min-w-0 max-w-md px-1 sm:px-0">
        <h2 className="m-0 break-words text-lg font-semibold leading-snug text-[#181512] sm:text-xl md:text-[1.35rem]">
          {title}
        </h2>
        <p className="mb-0 mt-2 break-words text-sm leading-relaxed text-[#666] sm:mt-2.5 sm:text-[15px]">
          {description}
        </p>
      </div>
    </div>
  );
}