import type { Extension } from "@codemirror/state";

import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import {
  bracketMatching,
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  ViewUpdate,
  crosshairCursor,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
} from "@codemirror/view";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { nord } from "@uiw/codemirror-theme-nord";
import debounce from "lodash.debounce";

import { FocusType } from "@/components/playground/atom";

const basicSetup: Extension = [
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
];

interface StateOptions {
  dark: boolean;
  setFocus: (focus: FocusType) => void;
  onChange: (getString: () => string) => void;
  content: string;
}

export const createCodeMirrorState = ({
  onChange,
  setFocus,
  content,
  dark,
}: StateOptions) => {
  return EditorState.create({
    doc: content,
    extensions: [
      dark ? nord : eclipse,
      basicSetup,
      markdown(),
      EditorView.updateListener.of((viewUpdate) => {
        if (viewUpdate.focusChanged)
          setFocus(viewUpdate.view.hasFocus ? "cm" : null);

        onCodeMirrorUpdate(onChange, viewUpdate);
      }),
    ],
  });
};

const onCodeMirrorUpdate = debounce(
  (onChange: (getString: () => string) => void, viewUpdate: ViewUpdate) => {
    if (!viewUpdate.view.hasFocus) {
      return;
    }
    const getString = () => viewUpdate.state.doc.toString();
    onChange(getString);
  },
  200,
);

interface ViewOptions extends StateOptions {
  root: HTMLElement;
}
export const createCodeMirrorView = ({ root, ...options }: ViewOptions) => {
  return new EditorView({
    state: createCodeMirrorState(options),
    parent: root,
  });
};
