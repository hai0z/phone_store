import dayjs from "dayjs";
import { BaseService } from "./base.service";
import { ProductVariantService } from "./product-variant.service";

interface CartItem {
  variant_id: number;
  quantity: number;
}

export class CartService extends BaseService {
  private variantService: ProductVariantService;

  constructor() {
    super();
    this.variantService = new ProductVariantService();
  }

  async syncWithServer(cartItems: CartItem[]) {
    const items: any = [];
    for (const item of cartItems) {
      const variant = await this.variantService.getVariantById(item.variant_id);

      const variantHasPromotion =
        variant?.promotional_price &&
        variant.promotion_start &&
        variant.promotion_end &&
        dayjs().isAfter(dayjs(variant.promotion_start)) &&
        dayjs().isBefore(dayjs(variant.promotion_end));

      const productImage = await this.prisma.productImages.findFirst({
        where: {
          AND: {
            product_id: variant?.product_id,
            color_id: variant?.color_id,
          },
        },
      });
      items.push({
        variant_id: item.variant_id,
        quantity: Math.min(
          item.quantity > 5 ? 5 : item.quantity,
          variant?.stock!
        ),
        product_id: variant?.product_id,
        product_name: variant?.product?.product_name,
        image: productImage?.image_url,
        ram: variant?.ram?.capacity,
        color: variant?.color?.color_name,
        storage: variant?.storage?.storage_capacity,
        salePrice: variantHasPromotion
          ? variant?.promotional_price
          : variant?.sale_price,
        stock: variant?.stock,
      });
    }
    return items;
  }

  async validateAndUpdateQuantity(variantId: number, quantity: number) {
    try {
      const variant = await this.variantService.getVariantById(variantId);
      if (!variant) {
        return {
          success: false,
          message: "Variant not found",
          data: null,
        };
      }
      if (quantity <= 0) {
        return {
          success: false,
          message: "Quantity must be greater than 0",
          data: null,
        };
      }

      if (quantity > variant.stock) {
        return {
          success: true,
          message: `Số lượng sản vượt quá số lượng hàng trong kho (${variant.stock})`,
          data: {
            variant_id: variantId,
            adjusted_quantity: variant.stock,
            original_quantity: quantity,
            is_adjusted: true,
            max_stock: variant.stock,
          },
        };
      }

      return {
        success: true,
        message: "Quantity is valid",
        data: {
          variant_id: variantId,
          adjusted_quantity: quantity,
          original_quantity: quantity + 1,
          is_adjusted: false,
          max_stock: variant.stock,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error validating quantity: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        data: null,
      };
    }
  }
}
