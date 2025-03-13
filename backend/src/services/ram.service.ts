import { BaseService } from "./base.service";
import { Ram } from "@prisma/client";

export class RamService extends BaseService {
  async getAllRams() {
    return this.prisma.ram.findMany();
  }

  async getRamById(ramId: number) {
    return this.prisma.ram.findUnique({
      where: { ram_id: ramId },
    });
  }

  async createRam(ramData: Omit<Ram, "ram_id">) {
    return this.prisma.ram.create({
      data: ramData,
    });
  }

  async updateRam(ramId: number, ramData: Partial<Omit<Ram, "ram_id">>) {
    return this.prisma.ram.update({
      where: { ram_id: ramId },
      data: ramData,
      include: {
        variants: true,
      },
    });
  }

  async deleteRam(ramId: number) {
    return this.prisma.ram.delete({
      where: { ram_id: ramId },
    });
  }
}
