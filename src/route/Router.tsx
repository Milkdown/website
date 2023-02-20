/* Copyright 2021, Milkdown by Mirone. */
import type { FC } from 'react'
import { lazy } from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import { Home } from '../component/Home'
import { LazyLoad } from '../component/LazyLoad'
import { usePages } from '../provider/SectionProvider'

const AsyncPlayground = lazy(() => import('../component/Playground').then(module => ({ default: module.Playground })))
const AsyncDocRenderer = lazy(() => import('../component/DocRenderer').then(module => ({ default: module.DocRenderer })))

export const Router: FC = () => {
  const pages = usePages()

  const playgroundURL = '/playground'
  const rootURL = '/'

  return (
    <Routes>
      {pages.map((page, i) => (
        <Route
          key={i.toString()}
          path={page.link}
          element={
            <LazyLoad>
              <Helmet>
                <title>Milkdown | {page.title}</title>
              </Helmet>
              <AsyncDocRenderer content={page.content} />
            </LazyLoad>
          }
        />
      ))}

      <Route
        path={playgroundURL}
        element={
          <LazyLoad>
            <Helmet>
              <title>Milkdown | Playground</title>
            </Helmet>
            <AsyncPlayground />
          </LazyLoad>
        }
      />

      <Route path={rootURL} element={
        <>
          <Helmet>
            <title>Milkdown</title>
          </Helmet>
          <Home />
        </>
      } />
    </Routes>
  )
}
