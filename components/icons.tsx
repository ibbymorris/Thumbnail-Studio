
import React from 'react';

export const VideoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 6.5L17.5 4.5V15.5L14.5 13.5M2.5 6C2.5 5.17157 3.17157 4.5 4 4.5H12C12.8284 4.5 13.5 5.17157 13.5 6V14C13.5 14.8284 12.8284 15.5 12 15.5H4C3.17157 15.5 2.5 14.8284 2.5 14V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SketchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 10 10" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.125 5.12492H1.875C1.32272 5.12492 0.875 5.57264 0.875 6.12492C0.875 6.67721 1.32272 7.12492 1.875 7.12492H7.125C7.67728 7.12492 8.125 7.57264 8.125 8.12492C8.125 8.67721 7.67728 9.12492 7.125 9.12492H4.875M4.875 5.12492H6.16789C6.3005 5.12492 6.42768 5.07225 6.52145 4.97848L9.27145 2.22848C9.46671 2.03322 9.46671 1.71663 9.27145 1.52137L8.47855 0.728478C8.28329 0.533216 7.96671 0.533216 7.77145 0.728478L5.02145 3.47848C4.92768 3.57225 4.875 3.69942 4.875 3.83203V5.12492Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DrawVideoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9612 2.57783C12.5586 2.05513 13.4589 2.0851 14.0202 2.64639C14.5815 3.20767 14.6115 4.10802 14.0888 4.7054L8 11.664V11.6666C8 13.3234 6.65685 14.6666 5 14.6666H2.5C2.22386 14.6666 2 14.4428 2 14.1666V11.6666C2 10.0098 3.34315 8.66664 5 8.66664H5.00261L11.9612 2.57783ZM6.22381 8.92684C6.89693 9.22791 7.43873 9.76964 7.7398 10.4428L13.3362 4.04689C13.5122 3.84572 13.5021 3.54251 13.3131 3.35349C13.1241 3.16447 12.8209 3.15438 12.6197 3.33041L6.22381 8.92684ZM5 9.66664C3.89543 9.66664 3 10.562 3 11.6666V13.6666H5C6.10457 13.6666 7 12.7712 7 11.6666C7 11.6171 6.9982 11.5682 6.99473 11.5197C6.92333 10.5326 6.13406 9.74331 5.14687 9.67191C5.09845 9.66837 5.04948 9.66664 5 9.66664Z" fill="currentColor" />
    <path d="M2.78903 4.93852C2.85353 4.90627 2.90584 4.85396 2.93809 4.78945L3.36804 3.92956C3.49088 3.68388 3.84149 3.68388 3.96433 3.92956L4.39427 4.78945C4.42653 4.85396 4.47883 4.90627 4.54334 4.93852L5.40323 5.36847C5.64891 5.49131 5.64891 5.84191 5.40323 5.96475L4.54334 6.39469C4.47883 6.42695 4.42653 6.47926 4.39427 6.54377L3.96433 7.40364C3.84148 7.64937 3.49088 7.64937 3.36804 7.40364L2.93809 6.54377C2.90584 6.47926 2.85353 6.42695 2.78903 6.39469L1.92913 5.96475C1.68345 5.84191 1.68345 5.49131 1.92913 5.36847L2.78903 4.93852Z" fill="currentColor" />
    <path d="M5.70603 2.47993C5.75211 2.45689 5.78947 2.41953 5.81251 2.37345L6.11961 1.75924C6.20735 1.58375 6.45779 1.58375 6.54553 1.75924L6.8526 2.37345C6.87567 2.41953 6.913 2.45689 6.95913 2.47993L7.57333 2.78703C7.7488 2.87477 7.7488 3.12521 7.57333 3.21295L6.95913 3.52005C6.913 3.54309 6.87567 3.58045 6.8526 3.62653L6.54553 4.24074C6.45779 4.41623 6.20735 4.41623 6.11961 4.24074L5.81251 3.62653C5.78947 3.58045 5.75211 3.54309 5.70603 3.52005L5.09182 3.21295C4.91633 3.12521 4.91633 2.87477 5.09182 2.78703L5.70603 2.47993Z" fill="currentColor" />
  </svg>
);

export const DrawEditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.55929 15.125C6.80178 14.9323 5.23971 14.4539 3.55888 12.743C0.749296 9.88327 0.0300494 5.97875 1.95239 4.02207C3.53188 2.41436 6.59253 2.53853 9.125 4.25M11.75 6.875C13.9356 9.44282 14.5373 11.8324 12.8604 13.1979C11.6042 14.2208 10.0146 13.0379 9.08705 12.126M6.875 9.125H8.71079C8.976 9.125 9.23036 9.01964 9.41789 8.83211L14.4156 3.83439C14.807 3.44298 14.806 2.80805 14.4133 2.4179L13.5684 1.57841C13.1772 1.1897 12.5451 1.1911 12.1556 1.58154L7.16703 6.58225C6.98002 6.76972 6.875 7.02371 6.875 7.2885V9.125Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 21 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 2.5C10.6657 2.5 10.8247 2.56585 10.9419 2.68306L14.6919 6.43306C14.936 6.67713 14.936 7.07287 14.6919 7.31694C14.4478 7.56102 14.0522 7.56102 13.8081 7.31694L11.125 4.63388V12.5C11.125 12.8452 10.8452 13.125 10.5 13.125C10.1548 13.125 9.875 12.8452 9.875 12.5V4.63388L7.19194 7.31694C6.94786 7.56102 6.55213 7.56102 6.30806 7.31694C6.06398 7.07287 6.06398 6.67713 6.30806 6.43306L10.0581 2.68306C10.1752 2.56585 10.3342 2.5 10.5 2.5Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.625 11.667C3.97017 11.667 4.25 11.9468 4.25 12.292V15.2087C4.25 15.784 4.71637 16.2503 5.29167 16.2503H15.7083C16.2837 16.2503 16.75 15.784 16.75 15.2087V12.292C16.75 11.9468 17.0298 11.667 17.375 11.667C17.7202 11.667 18 11.9468 18 12.292V15.2087C18 16.4743 16.974 17.5003 15.7083 17.5003H5.29167C4.02602 17.5003 3 16.4743 3 15.2087V12.292C3 11.9468 3.27983 11.667 3.625 11.667Z" fill="currentColor" />
  </svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1.5L12.5 6.5L18 7.5L14 11.5L15 17L10 14.5L5 17L6 11.5L2 7.5L7.5 6.5L10 1.5Z" />
  </svg>
);

export const ArrowIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PenIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 3.5L16.5 4.5M13 6L3 16V18H5L15 8M13 6L16.5 2.5L17.5 3.5L14 7M13 6L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TextIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4H15M10 4V16M7 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MenuIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const ImageDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const SoraIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.4203 0C12.1054 0 13.6311 0.682838 14.7356 1.78687C15.2399 1.65204 15.7697 1.57992 16.3165 1.57992C19.6877 1.57993 22.4206 4.31277 22.4206 7.68398C22.4205 8.23068 22.3482 8.76043 22.2134 9.26462C23.3174 10.3691 24.0001 11.8948 24.0001 13.5799C24.0001 16.4044 22.0817 18.7803 19.4768 19.4768C18.7803 22.0817 16.4044 24.0001 13.5799 24.0001C11.8945 24.0001 10.3685 23.3171 9.2639 22.2126C8.75992 22.3473 8.23041 22.4196 7.68398 22.4196C4.31277 22.4196 1.57992 19.6868 1.57992 16.3156C1.57992 15.7692 1.652 15.2398 1.78664 14.7359C0.682732 13.6313 0 12.1058 0 10.4208C2.27995e-05 7.59636 1.9184 5.22021 4.52321 4.52366C5.21959 1.91865 7.59573 3.48252e-05 10.4203 0ZM10.3078 9.66259C9.88615 8.08903 8.49038 7.09579 7.19061 7.44398C5.89089 7.79232 5.17877 9.3504 5.6004 10.924C5.60724 10.9495 5.61451 10.975 5.62195 11.0004L5.62101 11.0006L6.05203 12.6091C6.47373 14.1827 7.86945 15.176 9.16922 14.8277C10.4689 14.4794 11.181 12.9213 10.7595 11.3477L10.3284 9.73922L10.3275 9.73946C10.3213 9.71378 10.3146 9.6881 10.3078 9.66259ZM17.4759 7.89422C17.0543 6.32073 15.6585 5.32747 14.3587 5.67561C13.059 6.02395 12.3467 7.58208 12.7683 9.15561C12.7751 9.18115 12.7824 9.2069 12.7898 9.23227L12.7889 9.23251L13.2199 10.8408C13.6416 12.4143 15.0374 13.4077 16.3371 13.0596C17.6369 12.7113 18.349 11.1529 17.9273 9.57938L17.4966 7.97109L17.4956 7.97133C17.4894 7.94563 17.4828 7.91973 17.4759 7.89422ZM8.63906 10.9779C8.8421 10.9236 9.05102 11.0442 9.10548 11.2472C9.15981 11.4502 9.03917 11.6589 8.83617 11.7134C8.63311 11.7677 8.42424 11.6473 8.36976 11.4443C8.31542 11.2413 8.43604 11.0323 8.63906 10.9779ZM6.9478 8.60366C7.30382 9.15861 7.90687 9.50683 8.56548 9.53765C8.01048 9.89366 7.66228 10.4969 7.63149 11.1556C7.27548 10.6006 6.67221 10.2521 6.01361 10.2213C6.56858 9.86534 6.91701 9.26229 6.9478 8.60366ZM15.8074 9.20813C16.0104 9.15384 16.2191 9.27429 16.2736 9.47719C16.328 9.68023 16.2075 9.8891 16.0045 9.9436C15.8015 9.99796 15.5926 9.87737 15.5381 9.6743C15.4839 9.47128 15.6045 9.26258 15.8074 9.20813ZM14.1155 6.83366C14.4714 7.38869 15.0747 7.73683 15.7334 7.76764C15.1784 8.12364 14.8302 8.72695 14.7994 9.38556C14.4434 8.83063 13.8401 8.48237 13.1815 8.45157C13.7365 8.09556 14.0847 7.49234 14.1155 6.83366Z" fill="currentColor"></path>
    </svg>
);
  
export const BlankIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.00215 16.5416H15.2082C16.5889 16.5416 17.7082 15.4223 17.7082 14.0416V6.95825C17.7082 5.57754 16.5889 4.45825 15.2082 4.45825H4.7915C3.4108 4.45825 2.2915 5.57754 2.2915 6.95825V7.16659M7.00215 16.5416H6.69626C6.0609 16.5416 5.44266 16.3348 4.93436 15.9523C3.27065 14.7003 2.2915 12.7354 2.2915 10.6488V7.16659M7.00215 16.5416C4.86095 16.5416 4.86095 13.5338 5.71743 12.2448L4.80008 11.3243C3.19386 9.71258 2.2915 9.44575 2.2915 7.16659" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
);

export const PaletteIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
  </svg>
);

export const FaceIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm6.75 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
  </svg>
);

export const TrendingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

export const LayersIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
  </svg>
);

export const LinkIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

export const MagicWandIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

export const ChevronRight = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export const ChevronLeft = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);

export const MessageCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
);

export const MagicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 14.5v9"/><path d="M20 21.5h4.5"/><path d="M10 2 2 2v8"/><path d="M2 10h8"/><path d="M10 14.5v9"/><path d="M10 21.5H5.5"/><path d="M20 2 12 2v8"/><path d="M12 10h8"/></svg>
);

export const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const RobotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h1.5m12 0h1.5m-1.5 3.75h1.5m-1.5-7.5H15m-9 0H4.5m1.5 7.5H4.5m15-7.5v9a2.25 2.25 0 01-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25v-9m13.5 0a2.25 2.25 0 00-2.25-2.25H7.5a2.25 2.25 0 00-2.25 2.25m13.5 0H6" />
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const ChatBubbleIcon = ({ className }: { className?: string }) => (
   <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);
