import { getDb } from "./db"
import { ProductService } from "./features/resources/product/product.service"

export class AppContainer {
  productService: ProductService
  private static instance?: AppContainer

  private constructor() {
    const db = getDb()
    this.productService = new ProductService(db)
  }

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new AppContainer()
    }
    return this.instance
  }
}
