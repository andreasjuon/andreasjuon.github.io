import Image from "next/image";
import clsx from "clsx";

const WIDTH_CLASSES: Record<number, string> = {
  300: "max-w-xs",
  320: "max-w-xs",
  400: "max-w-sm",
  448: "max-w-md",
  500: "max-w-lg",
  512: "max-w-lg",
  576: "max-w-xl",
  672: "max-w-2xl",
};

function getWidthClass(width: number): string {
  return (
    WIDTH_CLASSES[width] ??
    (width <= 320
      ? "max-w-xs"
      : width <= 448
        ? "max-w-md"
        : width <= 512
          ? "max-w-lg"
          : width <= 576
            ? "max-w-xl"
            : "max-w-2xl")
  );
}

export type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  align?: "left" | "center" | "right";
  width?: number;
  height?: number;
};

export default function Figure({
  src,
  alt,
  caption,
  align = "center",
  width = 500,
  height,
}: FigureProps) {
  const aspectHeight = height ?? Math.round(width * 0.6);
  const widthClass = getWidthClass(width);

  return (
    <figure
      className={clsx(
        "my-0 max-w-full",
        widthClass,
        align === "left" && "md:float-left md:mr-4 float-none w-full",
        align === "right" && "md:float-right md:ml-4 float-none w-full",
        align === "center" && "mx-auto text-center"
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={aspectHeight}
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        className="max-w-full h-auto"
      />
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-2">{caption}</figcaption>
      )}
    </figure>
  );
}
