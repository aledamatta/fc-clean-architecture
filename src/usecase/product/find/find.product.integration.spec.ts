import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUsecase from "./find.product.usecase";

describe("integration test find product use case",() => {
   let sequelize: Sequelize;

   beforeEach(async () => {
      sequelize = new Sequelize({
         dialect: "sqlite",
         storage: ":memory:",
         logging: false,
         sync: { force: true },
      });

      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
   });

   afterEach(async () => {
      await sequelize.close();
   });

   it("should find a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new FindProductUsecase(productRepository);
      const product = new Product("123", "Product A", 1);

      await productRepository.create(product);

      const input = {
         id: product.id,
      };

      const output = {
         id: product.id,
         name: product.name,
         price: product.price,
      }   

      const result = await usecase.execute(input);

      expect(result).toEqual(output);      
   });

   it("should throw an error if product not found", async () => {
      const productRepository = new ProductRepository();
      const usecase = new FindProductUsecase(productRepository);
      
      const input = {
         id: "abc",
      };

      expect(usecase.execute(input)).rejects.toThrow("Product not found");
   });

});