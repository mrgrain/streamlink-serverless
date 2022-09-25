import * as path from 'path';
import merge from 'lodash.merge';
import { Component, Project } from 'projen';
import { SvgFile } from './SvgFile';

type DeepPartial<T> = Partial<{
  [K in keyof T]?: DeepPartial<T[K]>
}>;

export type WordmarkOptions = DeepPartial<FullWordmarkOptions>;

export interface FontOptions {
  family: string;
  size: number;
  weight: string;
  color: string;
};

export interface SizeOptions {
  width: number;
  height: number;
  scale?: number;
}

export interface LogoOptions extends SizeOptions {
  content: string;
}

interface FullWordmarkOptions {
  readonly fileBaseName: string;
  readonly dirName: string;
  readonly text: string;
  readonly raw?: string;
  readonly size: SizeOptions;
  readonly logo: LogoOptions;
  readonly padding: number;
  readonly font: FontOptions;
  readonly colorScheme?: {
    dark?: FontOptions;
    light?: FontOptions;
  };
}

export class Wordmark extends Component {
  public readonly options: FullWordmarkOptions;
  public constructor(project: Project, options: WordmarkOptions = {}) {
    super(project);

    this.options = this.getOptions(options) as FullWordmarkOptions;

    const halfHeight = this.options.size.height/2;
    const expectedLogoScale = this.options.size.height/this.options.logo.height;
    const logoScale = this.options.logo.scale ?? expectedLogoScale;
    const logoTranslate = {
      x: 0,
      y: logoScale/expectedLogoScale * -1 * halfHeight + halfHeight,
    };

    const wordmark = this.options.raw ?? this.wordmark(this.options.text, {
      x: logoScale * this.options.logo.width + this.options.padding,
      y: this.options.size.height/2,
    });

    const indent = 4;
    const content = `
<g transform="translate(${logoTranslate.x}, ${logoTranslate.y}) scale(${logoScale})">
${this.options.logo.content.split('\n').map(l => ' '.repeat(indent) + l).join('\n')}
</g>
`;

    new SvgFile(project, path.join(this.options.dirName, this.options.fileBaseName) + '.svg', {
      ...this.options.size,
      content: content + '\n' + wordmark,
      style: this.style(),
      indent,
    },
    );
  }

  public variant(name: string, options: Partial<WordmarkOptions>): Wordmark {
    const variant = {
      ...options,
      fileBaseName: `${this.options.fileBaseName}-${name}`,
    };
    return new Wordmark(this.project, merge({}, this.options, variant));
  }

  public dynamic(dark: Partial<WordmarkOptions>, light: Partial<WordmarkOptions>): Wordmark[] {
    return [
      this.variant('dark', dark),
      this.variant('light', light),
      this.variant('dynamic', {
        colorScheme: {
          dark: dark.font,
          light: light.font,
        },
      }),
    ];
  }

  private getOptions(options: WordmarkOptions): WordmarkOptions {
    const defaults: FullWordmarkOptions = {
      dirName: 'images',
      fileBaseName: 'wordmark',
      text: this.project.name,
      font: {
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        weight: '700',
        size: 90,
        color: '#6F7174',
      },
      padding: 35,
      logo: {
        width: 80,
        height: 80,
        content: `<svg xmlns="http://www.w3.org/2000/svg">
    <rect fill="#AAAAAA" width="80" height="80" />
    <line x1="0" x2="80" y1="0" y2="80" stroke="red" stroke-width="2" />
    <line x1="80" x2="0" y1="0" y2="80" stroke="red" stroke-width="2" />
</svg>`,
      },
      size: {
        width: 720,
        height: 200,
        scale: 1,
      },
    };

    return merge({}, defaults, options);
  }

  private wordmark(text: string, { x, y }: {
    x: number;
    y: number;
  }): string {
    return `<text x="${x}" y="${y}"><tspan dy="0.5ex">${text}</tspan></text>`;
  }

  private style() {
    const makeCSS = (opt: FontOptions, indent = 0, spaces = 4): string => {
      const outer = ' '.repeat(indent*spaces);
      const inner = ' '.repeat((indent+1)*spaces);

      const css = [outer + 'text {'];
      if (opt.family) {
        css.push(inner + `font-family: ${opt.family};`);
      }
      if (opt.weight) {
        css.push(inner + `font-weight: ${opt.weight};`);
      }
      if (opt.size) {
        css.push(inner + `font-size: ${opt.size}px;`);
      }
      if (opt.color) {
        css.push(inner + `fill: ${opt.color};`);
      }
      css.push(outer + '}');

      return css.join('\n');
    };

    const statements = [makeCSS(this.options.font)];

    if (this.options.colorScheme?.dark) {
      statements.push(`@media (prefers-color-scheme: dark) {\n${makeCSS(this.options.colorScheme?.dark, 1)}\n}`);
    }

    if (this.options.colorScheme?.light) {
      statements.push(`@media (prefers-color-scheme: light) {\n${makeCSS(this.options.colorScheme?.light, 1)}\n}`);
    }

    return statements.join('\n\n');
  }
}
