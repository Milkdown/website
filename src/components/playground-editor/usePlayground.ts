import { useSetInspector } from "@/components/playground-editor/InspectorProvider";
import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/core";
import type { Ctx, MilkdownPlugin } from "@milkdown/ctx";
import { block } from "@milkdown/plugin-block";
import { clipboard } from "@milkdown/plugin-clipboard";
import { cursor } from "@milkdown/plugin-cursor";
import { diagram, diagramSchema } from "@milkdown/plugin-diagram";
import { emoji, emojiAttr } from "@milkdown/plugin-emoji";
import { history } from "@milkdown/plugin-history";
import { indent } from "@milkdown/plugin-indent";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { math, mathBlockSchema } from "@milkdown/plugin-math";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import { slashFactory } from "@milkdown/plugin-slash";
import { trailing } from "@milkdown/plugin-trailing";
import { upload } from "@milkdown/plugin-upload";
import {
  codeBlockSchema,
  commonmark,
  listItemSchema,
} from "@milkdown/preset-commonmark";
import {
  footnoteDefinitionSchema,
  footnoteReferenceSchema,
  gfm,
} from "@milkdown/preset-gfm";
import { useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { $view, getMarkdown } from "@milkdown/utils";
import {
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from "@prosemirror-adapter/react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { refractor } from "refractor/lib/common";
import { Block } from "../playground/editor-component/Block";
import { CodeBlock } from "../playground/editor-component/CodeBlock";
import { Diagram } from "../playground/editor-component/Diagram";
import {
  FootnoteDef,
  FootnoteRef,
} from "../playground/editor-component/Footnote";
import {
  ImageTooltip,
  imageTooltip,
} from "../playground/editor-component/ImageTooltip";
import { linkPlugin } from "../playground/editor-component/LinkWidget";
import { ListItem } from "../playground/editor-component/ListItem";
import { MathBlock } from "../playground/editor-component/MathBlock";
import { Slash } from "../playground/editor-component/Slash";
import {
  tableSelectorPlugin,
  TableTooltip,
  tableTooltip,
  tableTooltipCtx,
} from "../playground/editor-component/TableWidget";
import { encode } from "@/utils/share";
import { useSetShare } from "./ShareProvider";
import { useToast } from "../toast";
import { useFeatureToggle } from "./FeatureToggleProvider";
import { useSetProseState } from "./ProseStateProvider";

const slash = slashFactory("MILKDOWN");

export const usePlayground = (
  defaultValue: string,
  onChange: (markdown: string) => void
) => {
  const pluginViewFactory = usePluginViewFactory();
  const nodeViewFactory = useNodeViewFactory();
  const widgetViewFactory = useWidgetViewFactory();
  const setProseState = useSetProseState();
  const setShare = useSetShare();
  const setInspector = useSetInspector();
  const toast = useToast();
  const {
    enableGFM,
    enableMath,
    enableDiagram,
    enableBlockHandle,
    enableTwemoji,
  } = useFeatureToggle();

  const gfmPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      gfm,
      tableTooltip,
      tableTooltipCtx,
      (ctx: Ctx) => async () => {
        ctx.set(tableTooltip.key, {
          view: pluginViewFactory({
            component: TableTooltip,
          }),
        });
      },
      $view(footnoteDefinitionSchema.node, () =>
        nodeViewFactory({ component: FootnoteDef })
      ),
      $view(footnoteReferenceSchema.node, () =>
        nodeViewFactory({ component: FootnoteRef })
      ),
      tableSelectorPlugin(widgetViewFactory),
    ].flat();
  }, [nodeViewFactory, pluginViewFactory, widgetViewFactory]);

  const mathPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      $view(mathBlockSchema.node, () =>
        nodeViewFactory({
          component: MathBlock,
          stopEvent: () => true,
        })
      ),
      math,
    ].flat();
  }, [nodeViewFactory]);

  const diagramPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      diagram,
      $view(diagramSchema.node, () =>
        nodeViewFactory({
          component: Diagram,
          stopEvent: () => true,
        })
      ),
    ].flat();
  }, [nodeViewFactory]);

  const blockPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      block,
      (ctx: Ctx) => () => {
        ctx.set(block.key, {
          view: pluginViewFactory({
            component: Block,
          }),
        });
      },
    ].flat();
  }, [pluginViewFactory]);

  const twemojiPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      emoji,
      (ctx: Ctx) => () => {
        ctx.set(emojiAttr.key, () => ({
          span: {},
          img: {
            class: "w-[1em] h-[1em] !m-0 inline-block mr-px align-text-top",
          },
        }));
      },
    ].flat();
  }, []);

  const editorInfo = useEditor(
    (root) => {
      return Editor.make()
        .enableInspector()
        .config((ctx) => {
          ctx.update(editorViewOptionsCtx, (prev) => ({
            ...prev,
            attributes: {
              class: "mx-auto p-1 box-border",
            },
          }));
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, defaultValue);
          ctx
            .get(listenerCtx)
            .markdownUpdated((_, markdown) => {
              debounce(onChange, 100)(markdown);
            })
            .updated((_, doc) => {
              const state = doc.toJSON();
              debounce(setProseState, 100)(state);
            });
          ctx.update(prismConfig.key, (prev) => ({
            ...prev,
            configureRefractor: () => refractor,
          }));
          ctx.set(imageTooltip.key, {
            view: pluginViewFactory({
              component: ImageTooltip,
            }),
          });
          ctx.set(slash.key, {
            view: pluginViewFactory({
              component: Slash,
            }),
          });
        })
        .config(nord)
        .use(commonmark)
        .use(linkPlugin(widgetViewFactory))
        .use(listener)
        .use(clipboard)
        .use(history)
        .use(cursor)
        .use(prism)
        .use(indent)
        .use(upload)
        .use(trailing)
        .use(imageTooltip)
        .use(slash)
        .use(
          $view(listItemSchema.node, () =>
            nodeViewFactory({ component: ListItem })
          )
        )
        .use(
          $view(codeBlockSchema.node, () =>
            nodeViewFactory({ component: CodeBlock })
          )
        );
    },
    [onChange, defaultValue]
  );

  const { get, loading } = editorInfo;

  useEffect(() => {
    requestAnimationFrame(() => {
      const effect = async () => {
        const editor = get();
        if (!editor) return;

        if (enableGFM) {
          editor.use(gfmPlugins);
        } else {
          await editor.remove(gfmPlugins);
        }
        if (enableMath) {
          editor.use(mathPlugins);
        } else {
          await editor.remove(mathPlugins);
        }
        if (enableDiagram) {
          editor.use(diagramPlugins);
        } else {
          await editor.remove(diagramPlugins);
        }
        if (enableBlockHandle) {
          editor.use(blockPlugins);
        } else {
          await editor.remove(blockPlugins);
        }
        if (enableTwemoji) {
          editor.use(twemojiPlugins);
        } else {
          await editor.remove(twemojiPlugins);
        }

        await editor.create();

        setInspector(() => editor.inspect());
      };

      effect().catch((e) => {
        console.error(e);
      });
    });
  }, [
    blockPlugins,
    diagramPlugins,
    get,
    gfmPlugins,
    mathPlugins,
    twemojiPlugins,
    loading,
    enableGFM,
    enableMath,
    enableDiagram,
    enableBlockHandle,
    enableTwemoji,
  ]);

  useEffect(() => {
    onChange(defaultValue);
  }, [defaultValue, onChange]);

  const router = useRouter();

  useEffect(() => {
    setShare(() => () => {
      const editor = get();
      if (!editor) return;

      const content = editor.action(getMarkdown());
      const base64 = encode(content);

      const url = new URL(location.href);
      url.searchParams.set("text", base64);
      navigator.clipboard.writeText(url.toString());
      toast("Share link copied.", "success");
      router.replace(url.toString());
    });
  }, [get, router, setShare, toast]);

  return editorInfo;
};
