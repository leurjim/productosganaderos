import Head from 'next/head'
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import { buildImage } from '@lib/cloudinary';

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss'

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{ product.name }</title>
        <meta name="description" content={`Find ${product.name} at Space Jelly Gear`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <img width={product.image.width} height={product.image.height} src={buildImage(product.image.public_id).toURL()} alt="" />
          </div>
          <div className={styles.productContent}>
            <h1>{ product.name }</h1>
            <div className={styles.productDescription} dangerouslySetInnerHTML={{
              __html: product.description?.html
            }} />
            <p className={styles.productPrice}>
              S/{ product.price }
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, locale }) {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/clhosnmjx69z101um63w459u3/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query pageProduct($slug: String, $locale: Locale!) {
        product(where: {slug: $slug}) {
          id
          image
          name
          price
          description {
            html
          }
          slug
          localizations(locales: [$locale]) {
            description {
              html
            }
            locale
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug,
      locale
    }
  });

  let product = data.data.product;

  if ( product.localizations.length > 0 ) {
    product = {
      ...product,
      ...product.localizations[0]
    }
  }

  return {
    props: {
      product
    }
  }
}

export async function getStaticPaths({ locales }) {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/clhosnmjx69z101um63w459u3/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageProducts {
        products {
          name
          price
          slug
          image
        }
      }
    `
  })

  const paths = data.data.products.map(product => {
    return {
      params: {
        productSlug: product.slug
      }
    }
  })
  
  return {
    paths: [
      ...paths,
      ...paths.flatMap(path => {
        return locales.map(locale => {
          return {
            ...path,
            locale
          }
        })
      })
    ],
    fallback: false
  }
}