/* Copyright 2021, Milkdown by Mirone. */
import type { CmdKey } from '@milkdown/core'
import { editorViewCtx, parserCtx } from '@milkdown/core'
import { redoCommand, undoCommand } from '@milkdown/plugin-history'
import { toggleEmphasisCommand, toggleStrongCommand, wrapInBlockquoteCommand, wrapInBulletListCommand, wrapInOrderedListCommand } from '@milkdown/preset-commonmark'
import { insertTableCommand, toggleStrikethroughCommand } from '@milkdown/preset-gfm'
import { Slice } from '@milkdown/prose/model'
import { Milkdown as Editor } from '@milkdown/react'
import { callCommand } from '@milkdown/utils'
import clsx from 'clsx'
import type { FC } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useLinkClass } from '../../hooks/useLinkClass'
import { usePlayground } from './usePlayground'

const Button: FC<{ icon: string; onClick?: () => void }> = ({ icon, onClick }) => {
  const linkClass = useLinkClass()
  return (
    <div className={clsx('flex h-10 w-10 cursor-pointer items-center justify-center', linkClass(false))} onClick={onClick}>
      <span className="material-symbols-outlined text-base">{icon}</span>
    </div>
  )
}

interface MilkdownProps {
  content: string
  onChange: (markdown: string) => void
}
export interface MilkdownRef { update: (markdown: string) => void }
export const Milkdown = forwardRef<MilkdownRef, MilkdownProps>(({ content, onChange }, ref) => {
  const { loading, get } = usePlayground(content, onChange)

  useImperativeHandle(ref, () => ({
    update: (markdown: string) => {
      if (loading)
        return
      const editor = get()
      editor?.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const parser = ctx.get(parserCtx)
        const doc = parser(markdown)
        if (!doc)
          return
        const state = view.state
        view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)))
      })
    },
  }))

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload))
  }

  return (
    <div className="relative h-full pt-16">
      <div className="border-nord4 divide-nord4 absolute inset-x-0 top-0 flex h-10 divide-x border-b dark:divide-gray-600 dark:border-gray-600">
        <Button icon="undo" onClick={() => call(undoCommand.key) } />
        <Button icon="redo" onClick={() => call(redoCommand.key) } />
        <Button icon="format_bold" onClick={() => call(toggleStrongCommand.key) } />
        <Button icon="format_italic" onClick={() => call(toggleEmphasisCommand.key)} />
        <Button icon="format_underlined" onClick={() => call(toggleStrikethroughCommand.key)} />
        <Button icon="table" onClick={() => call(insertTableCommand.key)} />
        <Button icon="format_list_bulleted" onClick={() => call(wrapInBulletListCommand.key)} />
        <Button icon="format_list_numbered" onClick={() => call(wrapInOrderedListCommand.key)} />
        <Button icon="format_quote" onClick={() => call(wrapInBlockquoteCommand.key)} />

        <div />
      </div>
      <div className="h-full overflow-auto overscroll-none pl-10">
        <Editor />
      </div>
    </div>
  )
})
Milkdown.displayName = 'Milkdown'
