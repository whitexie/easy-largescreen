import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'sales_data', comment: '销售数据' })
export class SalesData extends BaseEntity {
  @Column({ name: 'province', comment: '省份' })
  province: string;

  @Column({ name: 'province_code', comment: '省份代码' })
  province_code: string;

  @Column({ name: 'city', comment: '城市' })
  city: string;

  @Column({ name: 'city_code', comment: '城市代码' })
  city_code: string;

  @Column({ name: 'district', comment: '区县' })
  district: string;

  @Column({ name: 'district_code', comment: '区县代码' })
  district_code: string;

  @Column({ name: 'date', type: 'date', comment: '日期' })
  date: Date;

  @Column({ name: 'product_category', comment: '商品分类' })
  product_category: string;

  @Column({ name: 'product_name', comment: '商品名称' })
  product_name: string;

  @Column({ name: 'unit', comment: '单位' })
  unit: string;

  @Column({ name: 'origin', comment: '产地' })
  origin: string;

  @Column({ name: 'tax_included_price', type: 'decimal', precision: 15, scale: 4, comment: '含税价' })
  tax_included_price: number;

  @Column({ name: 'retail_price', type: 'decimal', precision: 15, scale: 4, comment: '零售价' })
  retail_price: number;

  @Column({ name: 'order_quantity', type: 'int', comment: '订购数量' })
  order_quantity: number;

  @Column({ name: 'sales_amount', type: 'decimal', precision: 15, scale: 4, comment: '销售金额' })
  sales_amount: number;

  @Column({ name: 'delivery_quantity', type: 'int', comment: '配送数' })
  delivery_quantity: number;

  @Column({ name: 'sales_quantity', type: 'int', comment: '销售数量' })
  sales_quantity: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 10, scale: 6, comment: '经度' })
  longitude: number;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 6, comment: '纬度' })
  latitude: number;

  @Column({ name: 'region', comment: '大区' })
  region: string;
}
