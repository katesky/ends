import {
  Location,
  SourceProduct,
  Calculation,
  CartRequest,
} from '@ends/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { SanityDocument } from '@sanity/client';
import { client } from './service/client';

@Injectable()
export class SanityDataService {
  sanityClientCredentials = client;
  logger: Logger;
  requestId = '';
  constructor() {
    this.logger = new Logger();
  }
  async getProducts() {
    return await this.sanityClientCredentials.fetch(
      `*[_type == "product"]{
        _id,
    title, sku
  }`
    );
  }

  async getLocations(zip: number): Promise<Location[]> {
    return await this.sanityClientCredentials.fetch(
      `*[_type=="location" && _id =='${zip}']`
    );
    //return  await this.sanityClientCredentials.getDocument(`location-${zip}`) as Location[];

    // return (<Location[]>locationData).filter(
    //   (c) => c.zip_code === zip
    // );
  }
  async getCalculations(state): Promise<Calculation[]> {
    return await this.sanityClientCredentials.fetch(
      `*[_type=="calculation" && state =='${state}']{
        city,hasFluidRate,hasRetailRate,hasTax,hasWholesaleRate,
        retailRate,state,description,
        title,year,wholesaleRate,fluidRate, categories[]->{ title}
      }`
    );
  }

  async getSourceProduct(product: string, clientId: string) {
    return await this.sanityClientCredentials.fetch(
      `*[_type == "product" && sku =='${product}' && clientId=='${clientId}' && taxable==true]{
        _id,
    title, sku, taxable, wholeSalePrice, categories[]->{ title}
  }`
    );
  }
  async saveCalculateRequest(cartRequest: CartRequest) {
    const doc = {
      _type: 'calculateRequest',
      title: 'Request from: ' + cartRequest.clientId,
      clientId: cartRequest.clientId,
      data: JSON.stringify(cartRequest),
    } as unknown as SanityDocument;
    return await client
      .create(doc)
      .then((res) => {
        this.logger.log(`Request was created, document ID is ${res._id}`);
        this.requestId = res._id;
      })
      .catch((err) => {
        this.logger.error('Oh no, the update failed: ', err.message);
      });
  }
  async saveRequestLogs(log: string) {
    await client
      .patch(`${this.requestId}`)
      .setIfMissing({ logs: [] })
      .insert('after', 'logs[-1]', [log])
      .commit()
      .then((res) => {
        this.logger.log(`Request was updated, document ID is ${res._id}`);
        return res.id;
      })
      .catch((err) => {
        this.logger.error('Oh no, the update failed: ', err.message);
      });
  }
  async saveRequestTotal(tax: number) {
    await client
      .patch(`${this.requestId}`)
      .set({ result: tax })
      .commit()
      .then((res) => {
        this.logger.log(`Tax was updated, document ID is ${res._id}`);
        return res.id;
      })
      .catch((err) => {
        this.logger.error('Oh no, the update failed: ', err.message);
      });
  }
  async checkClient(clientId: string): Promise<any> {
    return await this.sanityClientCredentials.fetch(
      `*[_type=="client" && clientId =='${clientId}']`
    );
  }
  async createLocations(cnt?: number): Promise<number> {
    //this is to load zipcode file
    // const locations = <Location[]>locationData;

    // const states = <State[]>statesData;
    // if (!cnt) cnt = locations.length;
    // this.logger.log(`cnt is ${cnt}`);
    const i = 0;
    // for (let index = 0; index < cnt + 1; index++) {
    //   const location = locations[index];
    //   this.logger.log(`Location, zip is ${location.zip_code}`);

    //   const state = states.find((s) => s.code === location.state);
    //   if (!state) {
    //     this.logger.log(`State not found:  ${location.state}`);
    //   }
    //   const doc: Location = {
    //     _id: location.zip_code.toString(),
    //     _type: 'location',
    //     city: location.city,
    //     county: location.county,
    //     zip_code: location.zip_code,
    //     title: `${location.zip_code} - ${location.state} - ${location.county} - ${location.city}`,
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     stateCode: location.state,
    //     state: state?.name,
    //   };

    //   await client
    //     .createOrReplace(doc)
    //     .then((res) => {
    //       this.logger.log(`Location was created, document ID is ${res._id}`);
    //       i++;
    //     })
    //     .catch((err) => {
    //       this.logger.error('Oh no, the update failed: ', err.message);
    //     });
    // }
    return i;
  }
}
