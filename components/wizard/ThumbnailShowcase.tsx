
import React from 'react';

type Thumbnail = {
  image: string;
  title: string;
  views: string;
};

const thumbnailData: Thumbnail[] = [
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_1.png",
    title: "The Race That Changed Formula 1 FOREVER..",
    views: "4,500,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_2.png",
    title: "SECRET Tattoos Footballers Don't Talk About",
    views: "800,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_3.png",
    title: "THE GREATEST FC 25 PACK OPENING SO FAR!",
    views: "3,700,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_4.png",
    title: "How One Person Destroyed 239 Lives",
    views: "2,200,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_5.png",
    title: "Millionaires VS Billionaires - What Are The Differences?",
    views: "1,100,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_6.png",
    title: "How Samuel Onuha Sniffed His Way to Prison",
    views: "400,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_7.png",
    title: "Trump's Tariff Plan Explained",
    views: "1,300,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_8.png",
    title: "They Just Ripped Off – A Simple Mistake with Dire..",
    views: "900,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_9.png",
    title: "The Untucked Boxer of ALL TIME",
    views: "1,000,000+ views",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/04b29eb7-5ab4-4dc3-b4c4-b808d575c6bb-pikzels-com/assets/images/images_10.png",
    title: "The Satifying Downfall of Ashton High",
    views: "2,900,000+ views",
  },
];

// Split data into two unique sets to avoid repetition between rows
const firstHalf = thumbnailData.slice(0, 5);
const secondHalf = thumbnailData.slice(5, 10);

// Duplicate the sets to ensure the row is long enough to fill the screen width before looping
const row1 = [...firstHalf, ...firstHalf, ...firstHalf];
const row2 = [...secondHalf, ...secondHalf, ...secondHalf];

const ThumbnailCard = ({ image, title, views }: Thumbnail) => (
  <div className="h-full rounded-xl border border-white/10 p-1 bg-[#121212]/90 shadow-[inset_0_0_16px_rgba(240,247,245,0.1)] w-[202px] flex-shrink-0 opacity-60 hover:opacity-100 transition-all duration-500">
    <div className="overflow-hidden rounded-lg shadow-[0_0px_0px_3px_rgba(255,255,255,0.05)]">
      <img 
        src={image} 
        alt={title} 
        className="w-[192px] h-[108px] object-cover"
      />
    </div>
    <div className="w-full px-2 py-1 mt-2">
      <div className="font-semibold text-xs text-gray-200 truncate">{title}</div>
      <div className="opacity-80 text-[10px] text-gray-400">{views}</div>
    </div>
  </div>
);

const ScrollingRow = ({ thumbnails, duration, reverse }: { thumbnails: Thumbnail[], duration: string, reverse?: boolean }) => (
  <div className="relative w-full overflow-hidden flex justify-start flex-nowrap">
      <div 
        className={`flex items-center space-x-4 animate-infinite-scroll ${reverse ? "[animation-direction:reverse]" : ""}`}
        style={{ animationDuration: duration }}
      >
        {thumbnails.map((thumb, index) => (
          <div key={`a-${thumb.title}-${index}`} className="h-full">
            <ThumbnailCard {...thumb} />
          </div>
        ))}
         {thumbnails.map((thumb, index) => (
          <div key={`b-${thumb.title}-${index}`} className="h-full" aria-hidden="true">
            <ThumbnailCard {...thumb} />
          </div>
        ))}
      </div>
    </div>
);


export const ThumbnailShowcase = () => {
    return (
        <>
            <style>
                {`
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                  animation: infinite-scroll linear infinite;
                }
                `}
            </style>
            <section className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="relative w-full h-full flex flex-col justify-end gap-4 overflow-hidden pb-8 opacity-50">
                    {/* Top Fade Mask - Hides the top part */}
                    <div className="absolute inset-x-0 top-0 z-10 h-3/4 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b] to-transparent"></div>
                    
                    {/* Bottom Fade Mask */}
                    <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#0b0b0b] to-transparent"></div>

                    {/* Side Fade Masks */}
                    <div className="absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-[#0b0b0b] to-transparent"></div>
                    <div className="absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-[#0b0b0b] to-transparent"></div>

                    <ScrollingRow thumbnails={row1} duration="80s" />
                    <ScrollingRow thumbnails={row2} duration="95s" reverse />
                </div>
            </section>
        </>
    );
};
