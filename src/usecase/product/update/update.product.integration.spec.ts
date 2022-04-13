import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "../create/create.product.usecase";
import UpdateProductUsecase from "./update.product.usecase";

describe("Integration test update product use case", () => {

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

   it("Should update a product", async() => {
      const productRepository = new ProductRepository;
      const usecase = new UpdateProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const inputInsert = { name: "Product A", price: 1 }
      const product = await createUsecase.execute(inputInsert);

      const inputUpdate = {
         id: product.id,
         name: "Produto A Updated",
         price: 11,
      }

      const result = await usecase.execute(inputUpdate);

      expect(result).toEqual(inputUpdate);
   });

   it("Should throw an error when product not found", async() => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUsecase(productRepository);

      const input = {
         id: "ABC",
         name: "Produto A",
         price: 11,
      }

      expect(usecase.execute(input)).rejects.toThrow("Product not found");
   });

   it("Should throw an error when name is required", async() => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const inputInsert = { name: "Product A", price: 1 }
      const product = await createUsecase.execute(inputInsert);

      const inputUpdate = {
         id: product.id,
         name: "",
         price: 11,
      }

      await expect(usecase.execute(inputUpdate)).rejects.toThrow("Name is required");
   });

   it("Should throw an error when price is less than zero", async() => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const inputInsert = { name: "Product A", price: 1 }
      const product = await createUsecase.execute(inputInsert);

      const inputUpdate = {
         id: product.id,
         name: "Product A",
         price: -1,
      }

      await expect(usecase.execute(inputUpdate)).rejects.toThrow("Price must be greater than zero");
   });

});