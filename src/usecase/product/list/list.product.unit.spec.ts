import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUsecase from "./list.product.usecase";

const product1 = ProductFactory.create("Product 1", 100);
const product2 = ProductFactory.create("Product 2", 200);

const MockRepository = () => {
   return {
      find: jest.fn(),
      findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
      create: jest.fn(),
      update: jest.fn(),
   };
}

describe("unit test for listing product use case", () => {

   it("should return all products", async () => {
      const productRepository = MockRepository();
      const usecase = new ListProductUsecase(productRepository);

      const result = await usecase.execute({});

      expect(result.products.length).toEqual(2);
      expect(result.products[0].id).toEqual(product1.id);
      expect(result.products[0].name).toEqual(product1.name);
      expect(result.products[0].price).toEqual(product1.price);
      expect(result.products[1].id).toEqual(product2.id);
      expect(result.products[1].name).toEqual(product2.name);
      expect(result.products[1].price).toEqual(product2.price);
   });
});