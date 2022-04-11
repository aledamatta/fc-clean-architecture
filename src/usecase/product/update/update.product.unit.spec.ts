import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUsecase from "./update.product.usecase";

const product = ProductFactory.create("Product 1", 1);

const input = {
   id: product.id,
   name: "Product 1 Updated",
   price: 2,
};

const MockRepository = () => {
   return {
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
   };
};

describe("Unit test update product use case", () => {

   beforeEach(() => {
      input.name = "Product 1 Updated";
      input.price = 2;
   });

   it("Should update a product", async() => {
      const productRepository = MockRepository();
      const usecase = new UpdateProductUsecase(productRepository);

      const result = await usecase.execute(input);

      expect(result).toEqual(input);
   });

   it("Should throw an error when product not found", async() => {
      const productRepository = MockRepository();
      const usecase = new UpdateProductUsecase(productRepository);

      productRepository.find.mockImplementation(() => {
         throw new Error("Product not found");
      });

      expect(usecase.execute(input)).rejects.toThrow("Product not found");
   });

   it("Should throw an error when name is required", async() => {
      const productRepository = MockRepository();
      const usecase = new UpdateProductUsecase(productRepository);

      input.name = "";

      await expect(usecase.execute(input)).rejects.toThrow("Name is required");
   });

   it("Should throw an error when price is less than zero", async() => {
      const productRepository = MockRepository();
      const usecase = new UpdateProductUsecase(productRepository);

      input.price = -1;

      await expect(usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
   });

});