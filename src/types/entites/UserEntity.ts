import type { PrefectureEntity } from "@/types/entites/PrefectureEntity";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  cpf: string;
  prefecture: PrefectureEntity;
}
