import { Callout } from "./Callout.js";
import { CodeBlock } from "./CodeBlock.js";
import { GitHubRepo } from "./GitHubRepo.js";
import { Mermaid } from "./Mermaid.js";
import { Video } from "./Video.js";
import { TweetEmbed, YouTubeEmbed, InstagramEmbed } from "./SocialEmbed.js";

export {
  Callout,
  CodeBlock,
  GitHubRepo,
  Mermaid,
  Video,
  TweetEmbed,
  YouTubeEmbed,
  InstagramEmbed,
};

type MdxComponentMap = Record<
  string,
  React.ComponentType<Record<string, unknown>>
>;

export function getMdxComponents(
  overrides: Partial<MdxComponentMap> = {}
): MdxComponentMap {
  return {
    Callout,
    CodeBlock,
    GitHubRepo,
    Mermaid,
    Video,
    TweetEmbed,
    YouTubeEmbed,
    InstagramEmbed,
    figure: CodeBlock,
    ...overrides,
  } as unknown as MdxComponentMap;
}
