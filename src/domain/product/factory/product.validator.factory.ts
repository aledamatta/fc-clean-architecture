import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../entity/product";
import ProductYupValidator from "../validador/product.yup.validator";

export default class ProductValidatorFactory {
   static create(): ValidatorInterface<Product> {
      return new ProductYupValidator();
   }
}