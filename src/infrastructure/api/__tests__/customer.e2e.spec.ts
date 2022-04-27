import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for customer", () => {
   beforeEach(async () => {
      await sequelize.sync({ force: true });
   });

   afterAll(async () => {
      await sequelize.close();
   });

   it("should create a customer", async () => {
      const response = await request(app)
         .post("/customer")
         .send({
            name: "John Doe",
            address: {
               street: "Street",
               city: "City",
               number: 123,
               zip: "12345",
            }
         });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("John Doe");
      expect(response.body.address.street).toBe("Street");
      expect(response.body.address.city).toBe("City");
      expect(response.body.address.number).toBe(123);
      expect(response.body.address.zip).toBe("12345");
   });

   it("should not create a customer", async () => {
      const response = await request(app)
         .post("/customer")
         .send({
            name: "John Doe",
         });

      expect(response.status).toBe(500);
   })

   it ("should list all customers", async () => {
      const response1 = await request(app)
      .post("/customer")
      .send({
         name: "John Doe",
         address: {
            street: "Street",
            city: "City",
            number: 123,
            zip: "12345",
         }
      });
      expect(response1.status).toBe(200);

      const response2 = await request(app)
      .post("/customer")
      .send({
         name: "Jane Doe",
         address: {
            street: "Street 2",
            city: "City 2",
            number: 1234,
            zip: "12344",
         }
      });
      expect(response2.status).toBe(200);

      const listReponse = await request(app).get("/customer").send();
      expect(listReponse.status).toBe(200);
      expect(listReponse.body.customers.length).toBe(2);
      const customer = listReponse.body.customers[0];
      expect(customer.name).toBe("John Doe");
      expect(customer.address.street).toBe("Street");
      const customer2 = listReponse.body.customers[1];
      expect(customer2.name).toBe("Jane Doe");
      expect(customer2.address.street).toBe("Street 2");

      const listResponseXML = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send();

      expect(listResponseXML.status).toBe(200);
      expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
      expect(listResponseXML.text).toContain(`<customers>`);
      expect(listResponseXML.text).toContain(`<customer>`);
      expect(listResponseXML.text).toContain(`<name>John Doe</name>`);
      expect(listResponseXML.text).toContain(`<address>`);
      expect(listResponseXML.text).toContain(`<street>Street</street>`);
      expect(listResponseXML.text).toContain(`<city>City</city>`);
      expect(listResponseXML.text).toContain(`<number>123</number>`);
      expect(listResponseXML.text).toContain(`<zip>12345</zip>`);
      expect(listResponseXML.text).toContain(`</address>`);
      expect(listResponseXML.text).toContain(`</customer>`);
      expect(listResponseXML.text).toContain(`<name>Jane Doe</name>`);
      expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
      expect(listResponseXML.text).toContain(`</customers>`);

   });
});