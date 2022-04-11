import CreateProductUsecase from "./create.product.usecase";

const input = {
   type: 'a',
   name: "Product a",
   price: 123,
}

const MockRepository = () => {
   return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
   };
}

describe ("Unit test create product use case", () => {

   beforeEach(() => {
         input.type = 'a';
         input.name = "Product a";
         input.price = 123;
   });

   it ("should create a product", async () => {
      const productRepository = MockRepository();
      const usecase = new CreateProductUsecase(productRepository);

      const output = {
         id: expect.any(String),
         name: input.name,
         price: input.price,
      }

      const result = await usecase.execute(input);

      expect(result).toEqual(output);
   });

   it ("should throw an error when name is missing", async () => {
      const productRepository = MockRepository();
      const usecase = new CreateProductUsecase(productRepository);

      input.name = "";

      await expect(usecase.execute(input)).rejects.toThrow("Name is required");
   });

   it ("shoud throw an error when price is less than 0", async () => {
      const productRepository = MockRepository();
      const usecase = new CreateProductUsecase(productRepository);

      input.price = -1;

      await expect(usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
   });

});