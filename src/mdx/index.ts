import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { GitHubRepo } from "./GitHubRepo";
import { Mermaid } from "./Mermaid";
import { Video } from "./Video";
import { TweetEmbed, YouTubeEmbed, InstagramEmbed } from "./SocialEmbed";

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
