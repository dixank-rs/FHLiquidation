"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import BackLink from "@/components/common/BackLink";
import { Button } from "@/components/common/Button";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/layout/SectionTitle";
import { IconChevronLeft, IconChevronRight, IconClose, IconZoomIn } from "@/components/common/icons";
import PageLayout from "@/components/layout/PageLayout";
import { assetPath } from "@/config/site";

const IMAGE_SRCS = [
  assetPath("/theme/images/v-img.jpg"),
  assetPath("/theme/images/v-img1.jpg"),
  assetPath("/theme/images/v-img2.jpg"),
  assetPath("/theme/images/v-img3.jpg"),
  assetPath("/theme/images/v-img4.jpg"),
] as const;

const boldFont = { fontFamily: "Muli-Bold, Arial, sans-serif" } as const;

const galleryGridClass =
  "gallery grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6";

const galleryActionBtnClass =
  "w-[calc(50%-0.375rem)] max-w-[12rem] shrink-0";

type GalleryTileProps = {
  src: string;
  alt: string;
  imageIndex: number;
  onOpen: (index: number) => void;
  actions: "delete" | "primary-delete";
};

function GalleryTile({ src, alt, imageIndex, onOpen, actions }: GalleryTileProps) {
  return (
    <article className="flex min-w-0 flex-col">
      <button
        type="button"
        className="group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-[#dee2e6] bg-[#f1f1ef] shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d36838] active:scale-[0.99]"
        onClick={() => onOpen(imageIndex)}
        aria-label={`Open image ${imageIndex + 1} in viewer`}
      >
        <span className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#f1f1ef] p-2 sm:aspect-[3/2] sm:p-3 lg:aspect-auto lg:h-[406px]">
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={1600}
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="max-h-full max-w-full object-contain object-center"
          />
        </span>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <IconZoomIn />
        </span>
      </button>
      <div
        className="mt-3 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {actions === "primary-delete" ? (
          <>
            <Button type="button" variant="secondary" layout="inline" className={galleryActionBtnClass}>
              Make Primary
            </Button>
            <Button type="button" variant="primary" layout="inline" className={galleryActionBtnClass}>
              Delete
            </Button>
          </>
        ) : (
          <Button type="button" variant="primary" layout="inline" className={galleryActionBtnClass}>
            Delete
          </Button>
        )}
      </div>
    </article>
  );
}

type ImageSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

function ImageSection({ id, title, children, className = "" }: ImageSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`scroll-mt-28 ${className}`}>
      <SectionTitle id={`${id}-heading`}>{title}</SectionTitle>
      {children}
    </section>
  );
}

export default function ViewAuctionImagesPage() {
  const params = useParams();
  const auctionId = typeof params.id === "string" ? params.id : "";

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openAt = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const changeImage = useCallback((delta: number) => {
    setCurrentIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return IMAGE_SRCS.length - 1;
      if (next >= IMAGE_SRCS.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") changeImage(-1);
      if (e.key === "ArrowRight") changeImage(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, closeLightbox, changeImage]);

  const backHref = auctionId ? `/auction/${encodeURIComponent(auctionId)}` : "/auction";

  return (
    <PageLayout activeKey="dashboard">
      <AppContainer>
        <PageHeader title="View Images" actions={<BackLink href={backHref}>Back</BackLink>} />

        <div className={`${contentPanelClass} sm:pb-10 lg:pb-12`}>
          <ImageSection id="generic-images" title="Generic Item Images" className="pb-8 lg:pb-0">
            <div className={galleryGridClass}>
              <GalleryTile src={IMAGE_SRCS[0]} alt="Generic item" imageIndex={0} onOpen={openAt} actions="delete" />
              <GalleryTile
                src={IMAGE_SRCS[1]}
                alt="Generic item"
                imageIndex={1}
                onOpen={openAt}
                actions="primary-delete"
              />
            </div>
          </ImageSection>

          <div className="ext-sp my-0 lg:mt-[90px]" aria-hidden>
            <hr className="m-0 border-t border-[#dee2e6]" />
          </div>

          <ImageSection id="item-specific-images" title="Item Specific Images" className="pt-8 lg:pt-0">
            <div className={galleryGridClass}>
              <GalleryTile src={IMAGE_SRCS[2]} alt="Item specific" imageIndex={2} onOpen={openAt} actions="delete" />
              <GalleryTile
                src={IMAGE_SRCS[3]}
                alt="Item specific"
                imageIndex={3}
                onOpen={openAt}
                actions="primary-delete"
              />
              <GalleryTile
                src={IMAGE_SRCS[4]}
                alt="Item specific"
                imageIndex={4}
                onOpen={openAt}
                actions="primary-delete"
              />
            </div>
          </ImageSection>

          {lightboxOpen ? (
            <div
              className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/85 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Image viewer"
              onClick={closeLightbox}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeLightbox();
              }}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-black/40 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                aria-label="Close"
              >
                <IconClose className="text-white" />
              </button>
              <p
                className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm"
                style={boldFont}
                aria-live="polite"
              >
                {currentIndex + 1} / {IMAGE_SRCS.length}
              </p>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-black/40 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:left-4"
                onClick={(e) => {
                  e.stopPropagation();
                  changeImage(-1);
                }}
                aria-label="Previous image"
              >
                <IconChevronLeft className="text-white" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic lightbox src */}
              <img
                src={IMAGE_SRCS[currentIndex]}
                alt={`Image ${currentIndex + 1} of ${IMAGE_SRCS.length}`}
                className="max-h-[min(85vh,900px)] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-black/40 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  changeImage(1);
                }}
                aria-label="Next image"
              >
                <IconChevronRight className="text-white" />
              </button>
            </div>
          ) : null}
        </div>
      </AppContainer>
    </PageLayout>
  );
}
