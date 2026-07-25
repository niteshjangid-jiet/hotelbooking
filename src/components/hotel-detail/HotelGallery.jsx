import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import { HiOutlinePhotograph, HiChevronLeft, HiChevronRight, HiX, HiArrowsExpand } from 'react-icons/hi';

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';

const HotelGallery = ({ images = [], hotelName = 'Hotel' }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeModalIndex, setActiveModalIndex] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-medium">
        No gallery images available.
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
      {/* MAIN SWIPER SLIDER */}
      <div className="relative group h-[320px] sm:h-[420px] md:h-[520px] w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Thumbs, EffectFade]}
          effect="fade"
          speed={600}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation={{
            prevEl: '.gallery-prev-btn',
            nextEl: '.gallery-next-btn',
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="h-full w-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="relative overflow-hidden">
              <div className="w-full h-full relative overflow-hidden cursor-pointer" onClick={() => setActiveModalIndex(idx)}>
                <img
                  src={img}
                  alt={`${hotelName} - Image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CUSTOM NAVIGATION ARROWS */}
        <button
          aria-label="Previous image"
          className="gallery-prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/10"
        >
          <HiChevronLeft className="text-2xl" />
        </button>
        <button
          aria-label="Next image"
          className="gallery-next-btn absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/10"
        >
          <HiChevronRight className="text-2xl" />
        </button>

        {/* EXPAND LIGHTBOX BUTTON */}
        <button
          onClick={() => setActiveModalIndex(0)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-slate-950/80 hover:bg-slate-900 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/15 transition-all shadow-lg hover:scale-105"
        >
          <HiArrowsExpand className="text-sm text-blue-400" />
          <span>Full Screen Gallery</span>
        </button>

        {/* IMAGE COUNTER BADGE */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 text-white text-xs font-semibold rounded-lg backdrop-blur-md border border-white/10">
          <HiOutlinePhotograph className="text-amber-400 text-sm" />
          <span>{images.length} Photos</span>
        </div>
      </div>

      {/* THUMBNAILS CAROUSEL (DESKTOP / TABLET) */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 7 },
          }}
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-16 sm:h-20 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all opacity-70 hover:opacity-100 [.swiper-slide-thumb-active_&]:border-blue-500 [.swiper-slide-thumb-active_&]:opacity-100">
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {activeModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between text-white border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-100">{hotelName}</h3>
              <p className="text-xs text-slate-400">Photo {activeModalIndex + 1} of {images.length}</p>
            </div>
            <button
              onClick={() => setActiveModalIndex(null)}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <HiX className="text-2xl" />
            </button>
          </div>

          {/* Modal Swiper */}
          <div className="relative flex-1 my-4 flex items-center justify-center max-h-[80vh]">
            <Swiper
              initialSlide={activeModalIndex}
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-full w-full flex items-center justify-center"
              onSlideChange={(swiper) => setActiveModalIndex(swiper.activeIndex)}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center p-2">
                  <img
                    src={img}
                    alt={`Full view ${idx + 1}`}
                    className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl mx-auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Modal Footer */}
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
            Press ESC or click close to return to hotel details.
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelGallery;
