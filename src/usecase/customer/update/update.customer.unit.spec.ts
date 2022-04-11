import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUsecase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
   "John",
   new Address("Street", 123, "Zip", "City")
);

const input = {
   id: customer.id,
   name: "John Updated",
   address: {
      street: "Street Updated",
      number: 1234,
      zip: "Zip Updated",
      city: "City Updated",
   },
};

const MockRepository = () => {
   return {
      find: jest.fn().mockReturnValue(Promise.resolve(customer)),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
   };
}

describe("Unit test update customer use case", () => {

   it("Should update a customer", async() => {
      const customerRepository = MockRepository();
      const usecase = new UpdateCustomerUsecase(customerRepository);

      const result = await usecase.execute(input);

      expect(result).toEqual(input);
   });

   it("Should throw an error when customer not found", async() => {
      const customerRepository = MockRepository();
      const usecase = new UpdateCustomerUsecase(customerRepository);

      customerRepository.find.mockImplementation(() => {
         throw new Error("Customer not found");
      });

      expect(usecase.execute(input)).rejects.toThrow("Customer not found");
   });

   it("Should throw an error when name is missing", async() => {
      const customerRepository = MockRepository();
      const usecase = new UpdateCustomerUsecase(customerRepository);

      input.name = "";

      await expect(usecase.execute(input)).rejects.toThrow("Name is required");

      input.name = "John Updated"
   });

   it("Should throw an error when street is missing", async() => {
      const customerRepository = MockRepository();
      const usecase = new UpdateCustomerUsecase(customerRepository);

      input.address.street = "";

      await expect(usecase.execute(input)).rejects.toThrow("Street is required");

      input.address.street = "Street Updated";
   });

});