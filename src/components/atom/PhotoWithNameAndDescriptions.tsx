const sizes = {
  sm: {
    iconWrapper: "w-11 h-11",
    textIcon: "text-[0.68rem]",
    title: "text-[0.9rem]",
    description: "text-[0.8rem]",
  },

  md: {
    iconWrapper: "w-11 h-11",
    textIcon: "text-[0.8rem]",
    title: "text-[1rem]",
    description: "text-[0.8rem]",
  },
};

type PhotoWithNameAndDescriptionsProps = {
  photo?: string;
  title?: string;
  description?: string;
  size?: "sm" | "md";
};

export default function PhotoWithNameAndDescriptions({
  photo,
  title,
  description,
  size = "md",
}: PhotoWithNameAndDescriptionsProps) {
  const s = sizes[size];
  return (
    <div className={"inline-flex w-fit gap-3 justify-center items-center"}>
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-500 ${s.iconWrapper}`}
      >
        <p className={`text-white font-bold ${s.textIcon}`}>
          {photo ?? "R-12"}
        </p>
      </div>

      <div>
        <p className={`font-bold ${s.title}`}>
          {title ?? "Centro -> E.M. João Paulo"}
        </p>

        <p
          className={`${s.description} truncate text-xs text-muted-foreground`}
        >
          {description ?? "Carlos mendes • 32 alunos"}
        </p>
      </div>
    </div>
  );
}
