export default {
  title: 'Product variant',
  name: 'productVariant',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Weight in grams',
      name: 'grams',
      type: 'number',
    },
    {
      title: 'Weight in fluid ml',
      name: 'fluidWeight',
      type: 'number',
    },
    {
      title: 'Wholesale Price',
      name: 'wholeSalePrice',
      type: 'number',
    },
    {
      title: 'SKU',
      name: 'sku',
      type: 'string',
    },
    {
      title: 'Taxable',
      name: 'taxable',
      type: 'boolean',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }
  ],
}
