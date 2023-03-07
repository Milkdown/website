/* Copyright 2021, Milkdown by Mirone. */
import clsx from 'clsx'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { usePageList, usePages } from '../../provider/SectionProvider'
import { ROOT, useHideSidePanel, useHoldSidePanel, useShowRootSidePanel, useShowSectionSidePanel, useSidePanelState } from '../../provider/SidePanelStateProvider'
import type { Section } from '../../route'
import { useLinkClass } from '../hooks/useLinkClass'

type SidePanelItem = {
  id: string
  text: string
  link?: string
  onClick?: () => void
  prefixIcon?: string
  suffixIcon?: string
}

type SidePanelGroupProps = {
  title?: string
  items: Array<SidePanelItem>
}

const SidePanelGroup: FC<SidePanelGroupProps> = ({ title, items }) => {
  const pages = usePages()
  const page = pages.find(page => page.link === location.pathname)
  const linkClass = useLinkClass()

  const getItemClassName = useCallback((isActive: boolean) => {
    return clsx(
      'cursor-pointer rounded-full p-4 font-light',
      'flex items-center justify-between gap-3',
      linkClass(isActive),
    )
  }, [linkClass])

  return (
    <div className="text-nord0 my-2">
      {title && <div className="p-4 text-lg font-medium">{title}</div>}
      <ul>
        {
          items.map((item, index) => {
            if (item.link) {
              return (
                <NavLink
                  key={index.toString()}
                  className={({ isActive }) => getItemClassName(isActive)}
                  to={item.link}
                >
                  {(item.prefixIcon && item.prefixIcon === '$') ? <span className="w-6" /> : <span className="material-symbols-outlined">{item.prefixIcon}</span>}
                  <span className="flex-1">{item.text}</span>
                  {item.suffixIcon && <span className="material-symbols-outlined">{item.suffixIcon}</span>}
                </NavLink>
              )
            }
            return (
              <div
                key={index.toString()}
                className={getItemClassName(page?.parentId === item.id)}
                onClick={item.onClick}
              >
                {(item.prefixIcon && item.prefixIcon === '$') ? <span className="w-6" /> : <span className="material-symbols-outlined">{item.prefixIcon}</span>}
                <span className="flex-1">{item.text}</span>
                {item.suffixIcon && <span className="material-symbols-outlined">{item.suffixIcon}</span>}
              </div>
            )
          })
        }
      </ul>
    </div>
  )
}

const getRoot = (playgroundURL: string, showSectionSidePanel: (id: string) => void): SidePanelGroupProps => {
  return {
    items: [
      {
        id: 'guide',
        text: 'guide',
        prefixIcon: 'design_services',
        suffixIcon: 'arrow_forward',
        onClick: () => showSectionSidePanel('guide'),
      },
      {
        id: 'recipes',
        text: 'recipes',
        prefixIcon: 'apps',
        suffixIcon: 'arrow_forward',
        onClick: () => showSectionSidePanel('recipes'),
      },
      {
        id: 'plugin',
        text: 'plugin',
        prefixIcon: 'extension',
        suffixIcon: 'arrow_forward',
        onClick: () => showSectionSidePanel('plugin'),
      },
      {
        id: 'api',
        text: 'api',
        prefixIcon: 'api',
        suffixIcon: 'arrow_forward',
        onClick: () => showSectionSidePanel('api'),
      },
      {
        id: 'playground',
        text: 'playground',
        prefixIcon: 'view_carousel',
        link: playgroundURL,
      },
    ],
  }
}

const sectionToGroup = (section?: Section): SidePanelGroupProps => {
  if (!section) {
    return {
      items: [],
    }
  }

  return {
    items: section.items.map((item): SidePanelItem => {
      return {
        id: item.id,
        text: item.title,
        link: item.link,
      }
    }),
  }
}

export const SidePanel: FC = () => {
  const holdSidePanel = useHoldSidePanel()
  const hideSidePanel = useHideSidePanel()
  const showSectionSidePanel = useShowSectionSidePanel()
  const showRootSidePanel = useShowRootSidePanel()
  const { mode, activeId } = useSidePanelState()
  const isRoot = activeId === ROOT
  const pageList = usePageList(activeId)
  const location = useLocation()
  const playgroundURL = '/playground'

  useEffect(() => {
    hideSidePanel(0)
  }, [hideSidePanel, location.pathname])

  const itemsGroup = useMemo(() => isRoot
    ? getRoot(playgroundURL, (key: string) => showSectionSidePanel(key, 'mobile'))
    : sectionToGroup(pageList),
  [isRoot, pageList, playgroundURL, showSectionSidePanel])

  const events = mode === 'mobile' ? {} : { onMouseEnter: holdSidePanel, onMouseLeave: () => hideSidePanel(500) }

  return (
    <div className="flex h-full w-full flex-col divide-y p-3 overflow-auto overscroll-none" {...events}>
      { mode === 'mobile' && !isRoot && <SidePanelGroup items={[{ id: ROOT, onClick: showRootSidePanel, text: 'back', prefixIcon: 'arrow_back' }]} />}
      <SidePanelGroup {...itemsGroup} />
    </div>
  )
}
