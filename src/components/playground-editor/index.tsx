import { editorViewCtx, parserCtx } from "@milkdown/kit/core";
import { Slice } from "@milkdown/kit/prose/model";
import { Selection } from "@milkdown/kit/prose/state";
import { FC, RefObject, useRef } from "react";
import { useImperativeHandle } from "react";
import { CrepeEditor } from "./crepe/CrepeEditor";
import { Crepe } from "@milkdown/crepe";

interface MilkdownProps {
  content: string;
  onChange: (markdown: string) => void;
  milkdownRef: RefObject<MilkdownRef>;
}

export interface MilkdownRef {
  update: (markdown: string) => void;
}

export const PlaygroundMilkdown: FC<MilkdownProps> = ({
  content,
  onChange,
  milkdownRef,
}) => {
  const crepeRef = useRef<Crepe>(null);

  useImperativeHandle(milkdownRef, () => ({
    update: (markdown: string) => {
      const crepe = crepeRef.current;
      if (!crepe) return;
      crepe.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const parser = ctx.get(parserCtx);
        const doc = parser(markdown);
        if (!doc) return;
        const state = view.state;
        const selection = state.selection;
        const { from } = selection;
        let tr = state.tr;
        tr = tr.replace(
          0,
          state.doc.content.size,
          new Slice(doc.content, 0, 0)
        );
        tr = tr.setSelection(Selection.near(tr.doc.resolve(from)));
        view.dispatch(tr);
      });
    },
  }));

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <CrepeEditor
        defaultValue={content}
        crepeRef={crepeRef}
        onChange={onChange}
      />
    </div>
  );
};
