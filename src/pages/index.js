import Head from 'next/head'
import Link from 'next/link';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

import { buildImage } from '@lib/cloudinary';

import Image from 'next/image'

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import products from '@data/products';

import styles from '@styles/Page.module.scss'

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroLink, heroBackground } = home;
  return (
    <Layout>
      <Head>
        <title>Instrumentos para Ganadería</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Productos Ganaderos</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{ heroTitle }</h2>
                <p>{ heroText }</p>
              </div>
              <Image className={styles.heroImage} width={heroBackground.width} height={heroBackground.height} src={buildImage(heroBackground.public_id).toURL()} alt="" />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Productos Destacados</h2>

        <ul className={styles.products}>
          {products.map(product => {
            const imageUrl = buildImage(product.image.public_id).resize('w_900,h_900').toURL();
            return (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image width={product.image.width} height={product.image.height} src={imageUrl} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      { product.name }
                    </h3>
                    <p className={styles.productPrice}>
                      S/{ product.price }
                    </p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  console.log('locale', locale);
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/clhosnmjx69z101um63w459u3/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageHome($locale: Locale!) {
        page(where: {slug: "home"}) {
          id
          heroLink
          heroText
          heroTitle
          name
          slug
          heroBackground
          localizations(locales: [$locale]) {
            heroText
            heroTitle
            locale
          }
        }
        products(first: 4) {
          id
          name
          price
          slug
          image
        }
      }
    `,
    variables: {
      locale
    }
  })

  let home = data.data.page;

  if ( home.localizations.length > 0 ) {
    home = {
      ...home,
      ...home.localizations[0]
    }
  }
  
  const products = data.data.products;

  return {
    props: {
      home,
      products
    }
  }
}