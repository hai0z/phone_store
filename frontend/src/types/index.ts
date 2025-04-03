export interface Brand {
  brand_id: number;
  brand_name: string;
  image_url?: string;
  products?: Product[];
}

export interface Category {
  category_id: number;
  category_name: string;
  products?: Product[];
}

export interface RAM {
  ram_id: number;
  capacity: string;
  variants?: ProductVariant[];
}

export interface Product {
  product_id: number;
  category_id: number;
  brand_id: number;
  product_name: string;
  description?: string;
  article?: string;
  specs?: any;
  sold_count: number;
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  ratings: Rating[];
  images?: ProductImage[];
}

export interface Color {
  color_id: number;
  color_name: string;
  hex: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface Storage {
  storage_id: number;
  storage_capacity: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  variant_id: number;
  product_id: number;
  color_id: number;
  storage_id: number;
  ram_id: number;
  original_price: number;
  sale_price: number;
  promotional_price?: number;
  promotion_start?: Date;
  promotion_end?: Date;
  stock: number;
  product?: Product;
  color?: Color;
  storage?: Storage;
  ram?: RAM;
  orderDetails?: OrderDetail[];
}

export interface ProductImage {
  image_id: number;
  product_id: number;
  color_id?: number;
  image_url: string;
  created_at: Date;
  product?: Product;
  color?: Color;
}

export interface Admin {
  admin_id: number;
  username: string;
  password: string;
  full_name: string;
  email: string;
  role: string;
}

export interface Customer {
  customer_id: number;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  orders?: Order[];
  comments?: Comment[];
  ratings?: Rating[];
  role: string;
  password: string;
}

export interface Voucher {
  voucher_id: number;
  code: string;
  discount_value: number;
  discount_type: string;
  min_order_value?: number;
  max_uses?: number;
  used_count: number;
  start_date?: Date;
  expiry_date?: Date;
  max_discount_value?: number;
  orders?: Order[];
}

export interface Order {
  order_id: number;
  customer_id: number;
  voucher_id?: number;
  order_date: Date;
  total_amount: number;
  status: string;
  customer?: Customer;
  voucher?: Voucher;
  orderDetails?: OrderDetail[];
}

export interface OrderDetail {
  order_detail_id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  order?: Order;
  variant?: ProductVariant;
}

export interface Comment {
  comment_id: number;
  product_id: number;
  customer_id: number;
  content: string;
  created_at: Date;
  product?: Product;
  customer?: Customer;
}

export interface Rating {
  rating_id: number;
  product_id: number;
  customer_id: number;
  rating: number;
  created_at: Date;
  product?: Product;
  customer?: Customer;
  content?: string;
}

export interface Location {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: District[];
}

export interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}
export interface FilterOptions {
  brands: Brand[];
  categories: Category[];
  colors: Color[];
  storages: Storage[];
  ram: Ram[];
  priceRange: PriceRange;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Ram {
  ram_id: number;
  capacity: string;
}
