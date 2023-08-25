import Link from 'next/link';
import { useRouter } from 'next/router';

import { FaShoppingCart } from 'react-icons/fa';

import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  const { locale: activeLocale, locales, asPath } = useRouter();

  const availableLocales = locales.filter(locale => locale !== activeLocale);

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            <a>Productos Ganaderos</a>
          </Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <Link href="/categories/productos">
              <a>Productos</a>
            </Link>
          </li>
          <li>
            <Link href="/stores">
              <a>Contáctenos</a>
            </Link>
          </li>
        </ul>
        <ul className={styles.headerLocales}>
          {availableLocales.map(locale => {
            return (
              <li key={locale}>
                <Link href={asPath} locale={locale}>
                  <a>
                    { locale.toUpperCase() }
                  </a>
                </Link>
              </li>
            )
          })}

        </ul>
      </Container>
    </header>
  )
}

export default Header;