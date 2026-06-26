interface DriverAvatarProps {
  initials: string;
  size?: "sm" | "md";
}

const sizes = {
  sm: { inner: "h-[60px] w-[60px] text-[18px]", outer: "h-[66px] w-[66px]" },
  md: { inner: "h-[70px] w-[70px] text-[22px]", outer: "h-[76px] w-[76px]" },
};

export default function DriverAvatar({
  initials,
  size = "sm",
}: DriverAvatarProps) {
  return (
    <div
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        p-[3px]
        ${sizes[size].outer}
      `}
      style={{
        background: "linear-gradient(135deg, #d1d5db, #f9fafb, #9ca3af)",
      }}
    >
      <div
        className={`
          flex
          h-full
          w-full
          items-center
          justify-center
          rounded-full
          bg-blue-700
          font-bold
          text-white
          shadow-md
          ${sizes[size].inner}
        `}
      >
        {initials}
      </div>
    </div>
  );
}
