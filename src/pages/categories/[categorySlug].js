import Head from 'next/head'
import Link from 'next/link';
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

import styles from '@styles/Page.module.scss'

export default function Category({ category, products }) {
  return (
    <Layout>
      <Head>
        <title>{ category.name }</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <h1>{ category.name }</h1>

        <ul className={styles.products}>
          {products.map(product => {
            const imageUrl = buildImage(product.image.public_id).resize('w_900,h_900').toURL();
            return (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                    <img width="900" height="900" src={imageUrl} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      { product.name }
                    </h3>
                    <p className={styles.productPrice}>
                      S/{ product.price.toFixed(2) }
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

export async function getStaticProps({ params }) {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/clhosnmjx69z101um63w459u3/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageCategory($slug: String = "") {
        category(where: {slug: $slug}) {
          id
          name
          slug
          products {
            id
            image
            name
            price
            slug
          }
        }
      }
    `,
    variables: {
      slug: params.categorySlug
    }
  })

  const category = data.data.category;

  return {
    props: {
      category,
      products: category.products
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
      query PageCategories {
        categories {
          id
          slug
        }
      }
    `
  })

  const paths = data.data.categories.map(category => {
    return {
      params: {
        categorySlug: category.slug
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