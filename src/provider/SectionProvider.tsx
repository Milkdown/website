/* Copyright 2021, Milkdown by Mirone. */

import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { Section } from '../route'
import { pageRouter } from '../route'

export const sectionsCtx = createContext<Section[]>([])

export const usePages = () => {
  const sections = useContext(sectionsCtx)

  return useMemo(() => sections.flatMap(section => section.items), [sections])
}

export const usePageList = (id?: string) => {
  const sections = useContext(sectionsCtx)
  return useMemo(() => {
    if (!id)
      return undefined

    return sections.find(section => section.id === id)
  }, [id, sections])
}

export const SectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const sections = useMemo(() => pageRouter, [])

  return (
    <sectionsCtx.Provider value={sections}>
      {children}
    </sectionsCtx.Provider>
  )
}
