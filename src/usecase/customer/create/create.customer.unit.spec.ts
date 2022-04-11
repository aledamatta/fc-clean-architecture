import CreateCustomerUsecase from "./create.customer.usecase";

const input = {
   name: "John",
   address: {
      street: "Street",
      number: 123,
      zip: "Zip",
      city: "city",
   },
}

const MockRepository = () => {
   return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
   };
}


describe("Unit test create customer use case", () => {

   it("should create a customer", async() => {
      const customerRepository = MockRepository();
      const usecase = new CreateCustomerUsecase(customerRepository);

      const output = {
         id: expect.any(String),
         name: input.name,
         address: {
            street: input.address.street,
            city: input.address.city,
            number: input.address.number,
            zip: input.address.zip,
         },
      }

      const result = await usecase.execute(input);

      expect(result).toEqual(output);
   });

   it("should throw an error when name is missing", async() => {
      const customerRepository = MockRepository();
      const usecase = new CreateCustomerUsecase(customerRepository);

      input.name = "";

      await expect(usecase.execute(input)).rejects.toThrow("Name is required");
   });

   it("should throw an error when street is missing", async() => {
      const customerRepository = MockRepository();
      const usecase = new CreateCustomerUsecase(customerRepository);

      input.address.street = "";

      await expect(usecase.execute(input)).rejects.toThrow("Street is required");
   });
      
});