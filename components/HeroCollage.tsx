import Image from "next/image";

const collageImages = [
  "/images/01-nhap-hoc/z7835022534399_4ea8460a0580ad9eed488013e81041c9.jpg",
  "/images/02-hoat-dong-clb/IMG_4349_Original.JPG",
  "/images/03-su-kien-gala/DSC03927.JPG",
  "/images/04-da-ngoai/AI6A6898.jpeg",
  "/images/01-nhap-hoc/z7938926022342_c56a366091763109b1aa18772106f7d4.jpg",
  "/images/02-hoat-dong-clb/IMG_5210_Original.JPG",
  "/images/03-su-kien-gala/IMG_8552.JPG",
  "/images/04-da-ngoai/IMG_5469.JPG",
];

export default function HeroCollage() {
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-4 sm:grid-cols-4 sm:grid-rows-2">
      {collageImages.map((src, index) => (
        <div key={src} className="relative">
          <Image
            src={src}
            alt="Ảnh tập thể K49 - FOIE"
            fill
            priority={index === 0}
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
