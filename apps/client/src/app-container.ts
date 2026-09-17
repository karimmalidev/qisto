import { getDb } from "./db"
import { CustomerService } from "./features/resources/customer/customer.service"
import { ProductService } from "./features/resources/product/product.service"

export class AppContainer {
  productService: ProductService
  private static instance?: AppContainer
  customerService: CustomerService

  private constructor() {
    const db = getDb()
    this.productService = new ProductService(db)
    this.customerService = new CustomerService(db)
  }

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new AppContainer()
    }
    return this.instance
  }
}
