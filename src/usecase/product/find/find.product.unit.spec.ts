import Product from "../../../domain/product/entity/product";
import FindProductUsecase from "./find.product.usecase";

const product = new Product("123", "Product A", 1);

const MockRepository = () => {
   return {
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
   };
};

describe("unit test find product use case", () => {

   it("should find a product", async () => {
      const productRepository = MockRepository();
      const usecase = new FindProductUsecase(productRepository);

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
      const productRepository = MockRepository();
      productRepository.find.mockImplementation(() => {
         throw new Error("Product not found");
      });

      const usecase = new FindProductUsecase(productRepository);

      const input = {
         id: "abc",
      };

      expect(usecase.execute(input)).rejects.toThrow("Product not found");
   });

});