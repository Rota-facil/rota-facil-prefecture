type PhotoWithNameAndDescriptionsProps = {
  photo?: string;
  title?: string;
  description?: string;
};

export default function PhotoWithNameAndDescriptions(
  props: PhotoWithNameAndDescriptionsProps,
) {
  return (
    <div className={"inline-flex w-fit gap-3 justify-center items-center"}>
      <div
        className={
          "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-500 w-11 h-11 "
        }
      >
        <p className={"text-white font-bold text-[0.8rem]"}>
          {props.photo ?? "R-12"}
        </p>
      </div>

      <div>
        <p className={"font-bold text-[1rem]"}>
          {props.title ?? "Centro -> E.M. João Paulo"}
        </p>

        <p className={"text-[0.8rem] truncate text-xs text-muted-foreground"}>
          {props.description ?? "Carlos mendes • 32 alunos"}
        </p>
      </div>
    </div>
  );
}
