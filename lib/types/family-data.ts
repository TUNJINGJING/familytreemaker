// 家族树数据类型定义（遵循 SRP: 单一数据结构定义）

export interface FamilyMemberData {
  "first name": string;
  "last name": string;
  birthday: string;
  avatar: string;
  gender: "M" | "F";
  [key: string]: any; // 允许自定义字段
}

export interface FamilyMemberRels {
  spouses: string[];
  children: string[];
  parents: string[];
}

export interface FamilyMember {
  id: string;
  data: FamilyMemberData;
  rels: FamilyMemberRels;
}

export type FamilyData = FamilyMember[];

// 默认空树（遵循 YAGNI: 只提供最基本的默认数据）
export const defaultFamilyData: FamilyData = [
  {
    id: "root",
    data: {
      "first name": "You",
      "last name": "",
      birthday: "",
      avatar: "",
      gender: "M",
    },
    rels: {
      spouses: [],
      children: [],
      parents: [],
    },
  },
];
