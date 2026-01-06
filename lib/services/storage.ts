// 数据持久化服务（遵循 SRP: 只负责数据存储）
import type { FamilyData } from "@/lib/types/family-data";
import { defaultFamilyData } from "@/lib/types/family-data";

const STORAGE_KEY = "family-tree-data";

// 遵循 DIP: 定义抽象接口
export interface StorageService {
  load(): FamilyData | null;
  save(data: FamilyData): void;
  clear(): void;
}

// 具体实现：LocalStorage
export class LocalStorageService implements StorageService {
  // 幂等性: 多次加载返回相同结果
  load(): FamilyData | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as FamilyData;
    } catch (error) {
      console.error("Failed to load family data:", error);
      return null;
    }
  }

  // 幂等性: 多次保存相同数据结果一致
  save(data: FamilyData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save family data:", error);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear family data:", error);
    }
  }
}

// 工厂函数（遵循 OCP: 可扩展支持其他存储方式）
export function createStorageService(): StorageService {
  return new LocalStorageService();
}

// 快捷方法
export function loadFamilyData(): FamilyData {
  const storage = createStorageService();
  return storage.load() || defaultFamilyData;
}

export function saveFamilyData(data: FamilyData): void {
  const storage = createStorageService();
  storage.save(data);
}
