import { BaseService } from "./base.service";
import { Colors } from "@prisma/client";

export class ColorService extends BaseService {
  async getAllColors() {
    return this.prisma.colors.findMany();
  }

  async getColorById(colorId: number) {
    return this.prisma.colors.findUnique({
      where: { color_id: colorId },
    });
  }

  async createColor(colorData: Omit<Colors, "color_id">) {
    return this.prisma.colors.create({
      data: colorData,
    });
  }

  async updateColor(
    colorId: number,
    colorData: Partial<Omit<Colors, "color_id">>
  ) {
    return this.prisma.colors.update({
      where: { color_id: colorId },
      data: colorData,
      include: {
        variants: true,
        images: true,
      },
    });
  }

  async deleteColor(colorId: number) {
    return this.prisma.colors.delete({
      where: { color_id: colorId },
    });
  }
}
