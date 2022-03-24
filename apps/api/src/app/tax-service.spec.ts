import { city } from './../../../../dist/apps/api/assets/data/USCities';
import { Message } from './../../../../libs/api-interfaces/src/lib/api-interfaces';
import { NotFoundException } from '@nestjs/common';
import { Address, CartRequest, Product, Shipping } from '@ends/api-interfaces';
import { SanityDataService } from './sanity-data.service';

import { TaxService } from './tax.service';

fdescribe('TaxService', () => {
  let service: TaxService;

  beforeEach(() => {
    service = new TaxService(new SanityDataService());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return an error when invalid state or zip', () => {
    const request = mockCart();
    expect(() => service.culculate(request)).toThrow(NotFoundException);
  });

  it('should return zero if nothing is found in the calculations for this state', () => {
    const request = mockCart();
    request.shipping.address.state = 'someste';
    const result = service.culculate(request);
    // Done
    expect(result).toEqual(0);
  });

  it('should return zero if city in calaculations doesnt match this city', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.shopId = '1234566';
    request.cart = { products: [product] };
    request.total = 24.98;
    address.zipCode = '77435';
    address.state = 'TX';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Done
    expect(result).toEqual(0);
  });
  it('should return zero if county in calaculations doesnt match this county', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.shopId = '1234566';
    request.cart = { products: [product] };
    request.total = 24.98;
    address.zipCode = '77435';
    address.state = 'TX';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Done
    expect(result).toEqual(0);
  });
  it('should return zero if calaculation hasTax==false', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.shopId = '1234566';
    request.cart = { products: [product] };
    request.total = 24.98;
    address.zipCode = '85221';
    address.state = 'AZ';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Done
    expect(result).toEqual(0);
  });
  it('should return zero when product ENDSTaxable===false', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.shopId = '1234566';
    request.cart = { products: [product] };
    request.total = 24.98;
    address.zipCode = '77412';
    address.state = 'TX';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Pending
    expect(result).toEqual(0);
  });
  it('should return 109.9 if calaculation hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    request.total = 24.98;
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Done
    expect(result).toEqual(109.9);
  });
  it('should return 11.99 if calaculation hasFluidRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 12.99, quanity: 3 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93210';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Pending
    expect(result).toEqual(90);
  });
  it('should return 12.99 if calaculation hasRetailRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 15.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '77360';
    address.state = 'TX';
    request.shipping = { address: address };
    const result = service.culculate(request);
    // Pending
    expect(result).toEqual(319.8);
  });

  it('should return 13.99 if state and city in calaculation hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 14.99 if state, city, county (3 records) in calaculation hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 15.99 if county in calaculations (1 record) hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 15.98 if city in calaculations (1 record) hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 15.97 if state in calaculations (1 record) hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 16.99 if state and county in calaculations (2 records) hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 17.99 if state and city in calaculations (2 records) hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 12.99, quanity: 1 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(109.9);
  });
  it('should return 18.99 if 2 products in cart hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    request.shopId = '1234566';
    product = { product: '123', price: 10.99, quanity: 1 };
    let products = [];
    products.push(product);
    product = { product: '23567', price: 13.99, quanity: 2 };
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(329.7);
  });
  it('should return 19.99 if 1 product quanity 2 in cart hasWholesaleRate==true', () => {
    let request = new CartRequest();
    let address = new Address();
    let product = new Product();
    product = { product: '123', price: 10.99, quanity: 2 };
    request.shopId = '1234566';
    let products = [];
    products.push(product);
    request.cart = { products: products };
    address.zipCode = '93201';
    address.state = 'CA';
    request.shipping = { address: address };
    const result = service.culculate(request);
    expect(result).toEqual(219.8);
  });
});
function mockCart() {
  const request = new CartRequest();
  const address = new Address();
  const product = new Product();
  product[0] = { product: '123', price: 2, quanity: 1 };
  product[1] = { product: '12356', price: 3, quanity: 2 };
  request.shopId = '1234566';
  request.cart = { products: [product] };
  request.total = 24.98;
  address.zipCode = '60030';
  address.state = 'IL1';
  request.shipping = { address: address };
  return request;
}
