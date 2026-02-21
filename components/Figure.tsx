import Image from "next/image";
import clsx from "clsx";

export default function Figure({
  src,
  alt,
  caption,
  align = "center",
  width = 500,
}) {
  return (
    <figure
      className={clsx(
        "my-6",
        align === "left" && "float-left mr-4",
        align === "right" && "float-right ml-4",
        align === "center" && "mx-auto text-center",
      )}
      style={{ maxWidth: width }}
    >
      <Image src={src} alt={alt} width={width} height={width * 0.6} />
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
