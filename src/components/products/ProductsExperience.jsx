'use client'

import { useEffect, useRef } from 'react'
import { AboutStatement } from '@/components/about/AboutSections'
import { useSmoothScroll } from '@/components/about/useSmoothScroll'
import { QuoteProvider, useQuote } from './QuoteContext'
import CrateScene from './CrateScene'
import ProductsHero from './ProductsHero'
import ProductsAisle from './ProductsAisle'
import { ProductsProcess, ProductsCta } from './ProductsSections'
import QuoteDock from './QuoteDock'
import { productsStatement } from '@/data/products'
import about from '@/components/about/About.module.css'

/*
 * The Products page: unpack the crate, walk the aisle adding categories to a quote, then send it.
 * The glass crate behind the page fills with one block per category in the quote.
 */
export default function ProductsExperience() {
  useSmoothScroll()

  return (
    <QuoteProvider>
      <ProductsPage />
    </QuoteProvider>
  )
}

function ProductsPage() {
  const ref = useRef(null)
  const { ids } = useQuote()

  // The crate reads the quote size from here.
  useEffect(() => {
    if (ref.current) ref.current.dataset.quoteCount = String(ids.length)
  }, [ids.length])

  return (
    <div ref={ref} className={about.page} data-crate-page>
      <CrateScene />
      <ProductsHero />
      <AboutStatement label="(What we supply)" parts={productsStatement.parts} by={null} />
      <ProductsAisle />
      <ProductsProcess />
      <ProductsCta />
      <QuoteDock />
    </div>
  )
}
