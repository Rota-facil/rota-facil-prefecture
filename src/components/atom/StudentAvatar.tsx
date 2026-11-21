import PhotoPreview from "@/components/atom/PhotoPreview";

interface StudentAvatarProps {
  name: string;
  photoUrl?: string;
}

export default function StudentAvatar({ name, photoUrl }: StudentAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-500 p-0.5 shadow-sm">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-blue-700 text-xs font-bold text-white">
        {photoUrl ? (
          <PhotoPreview
            src={photoUrl}
            alt={`Foto de ${name}`}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </div>
    </div>
  );
}
