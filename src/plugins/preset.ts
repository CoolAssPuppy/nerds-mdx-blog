import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkSocialEmbed } from "./remark-social-embed";

type PluginPresetOptions = {
  readonly socialEmbeds?: boolean;
  readonly codeTheme?: string;
};

export function getRemarkPlugins(
  options: PluginPresetOptions = {}
): unknown[] {
  const { socialEmbeds = true } = options;
  const plugins: unknown[] = [remarkGfm];

  if (socialEmbeds) {
    plugins.push(remarkSocialEmbed);
  }

  return plugins;
}

export function getRehypePlugins(
  options: PluginPresetOptions = {}
): unknown[] {
  const { codeTheme = "github-dark" } = options;

  return [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      { behavior: "wrap", properties: { className: ["anchor"] } },
    ],
    [rehypePrettyCode, { theme: codeTheme }],
  ];
}
