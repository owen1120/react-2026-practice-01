import { Oval } from "react-loader-spinner";

export default function ScreenLoading({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center flex-col gap-4 transition-opacity duration-300">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#06b6d4" 
        secondaryColor="#3f3f3f" 
        strokeWidth={4}
        strokeWidthSecondary={4}
        ariaLabel="oval-loading"
      />
      <p className="text-tech-blue-500 font-bold tracking-widest text-sm animate-pulse">
        LOADING SYSTEM...
      </p>
    </div>
  );
}