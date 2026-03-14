export interface Brand {
  id: number;
  name: string;
  slug: string;
  icon: string;
  status: number;
}

export interface BrandsResponse {
  success: boolean;
  message: string;
  data: Brand[];
}
