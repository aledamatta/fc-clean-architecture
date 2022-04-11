import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import ListCustomerUsecase from './list.customer.usecase';


const customer1 = CustomerFactory.createWithAddress(
   "John Doe",
   new Address("Street 1", 1, "Zip 1", "City 1")
);

const customer2 = CustomerFactory.createWithAddress(
   "Jane Doe",
   new Address("Street 2", 2, "Zip 2", "City 2")
);

const MockRepository = () => {
   return {
      find: jest.fn(),
      findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
      create: jest.fn(),
      update: jest.fn(),
   };
}

describe("Unit test for listing customer use case", () => {

   it("Should return all customers", async() => {
      const customerRepository = MockRepository();
      const usecase = new ListCustomerUsecase(customerRepository);

      const result = await usecase.execute({});

      expect(result.customers.length).toEqual(2);
      expect(result.customers[0].id).toEqual(customer1.id);
      expect(result.customers[0].name).toEqual(customer1.name);
      expect(result.customers[0].address.street).toEqual(customer1.Address.street);
      expect(result.customers[1].id).toEqual(customer2.id);
      expect(result.customers[1].name).toEqual(customer2.name);
      expect(result.customers[1].address.street).toEqual(customer2.Address.street);
   });
});