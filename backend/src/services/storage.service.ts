import { BaseService } from "./base.service";
import { Storages } from "@prisma/client";

export class StorageService extends BaseService {
  async getAllStorages() {
    return this.prisma.storages.findMany();
  }

  async getStorageById(storageId: number) {
    return this.prisma.storages.findUnique({
      where: { storage_id: storageId },
    });
  }

  async createStorage(storageData: Omit<Storages, "storage_id">) {
    return this.prisma.storages.create({
      data: storageData,
    });
  }

  async updateStorage(
    storageId: number,
    storageData: Partial<Omit<Storage, "storage_id">>
  ) {
    return this.prisma.storages.update({
      where: { storage_id: storageId },
      data: storageData,
      include: {
        variants: true,
      },
    });
  }

  async deleteStorage(storageId: number) {
    return this.prisma.storages.delete({
      where: { storage_id: storageId },
    });
  }
}
