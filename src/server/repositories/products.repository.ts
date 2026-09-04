import Stripe from 'stripe'

export class ProductsRepository {
  protected client = new Stripe(process.env.STRIPE_API_KEY!)

  public async findAll(): Promise<Product[]> {
    const response = await this.client.products.list({ active: true, expand: ['data.default_price'], limit: 100 })

    response.data.sort((a, b) => parseInt(b.metadata?.priority || '0') - parseInt(a.metadata?.priority || '0'))

    const products = new Array<Product>()

    for (const product of response.data) {
      // price is already expanded by default
      const price = product.default_price as Stripe.Price
      products.push({
        id: product.id,
        name: product.name,
        price: price.unit_amount || 0,
        description: product.description || '',
        imageUrl: product.images?.[0] || null,
      })
    }

    return products
  }

  public async createCheckoutSession(productId: string, origin: string): Promise<string | null> {
    const product = await this.client.products.retrieve(productId, {
      expand: ['default_price'],
    })

    const price = product.default_price as Stripe.Price
    if (!price?.id) {
      throw new Error('Produto não possui preço padrão configurado.')
    }

    const session = await this.client.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/#presentes`,
    })

    return session.url
  }
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string | null
}
