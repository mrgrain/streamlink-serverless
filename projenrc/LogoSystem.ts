import { readFileSync } from 'fs';
import * as path from 'path';
import { Component, Project, Task } from 'projen';
import { FontOptions, SizeOptions, TranslateOptions, Wordmark } from './Wordmark';

interface LogoSystemOptions {
  readonly dirName?: string;
  readonly logo?: {
    readonly file?: string;
  } & SizeOptions & Partial<TranslateOptions>;
  readonly wordmark?: {
    readonly text?: string;
    readonly raw?: string;
    readonly fileBase?: string;
    readonly size?: Partial<SizeOptions>;
    readonly font?: Partial<FontOptions>;
    readonly colorScheme?: {
      readonly dark?: Partial<FontOptions>;
      readonly light?: Partial<FontOptions>;
    };
  };
}

export class LogoSystem extends Component {
  public readonly convertTask: Task;

  public constructor(project: Project, options: LogoSystemOptions = {}) {
    super(project);

    const dirName = options.dirName ?? 'images';
    const maybeLogoPath = path.join(dirName, options.logo?.file ?? 'logo.svg');

    this.convertTask = project.addTask('logo', {
      exec: `find ${dirName} -iname "*.svg" | xargs -L1 -I{} sh -c "rsvg-convert -h 1024 {} > ${dirName}/\\$(basename {} .svg).png"`,
    });

    const wordmark = new Wordmark(project, {
      dirName,
      size: options.wordmark?.size,
      text: options.wordmark?.text,
      raw: options.wordmark?.raw,
      font: options.wordmark?.font,
      logo: {
        ...options.logo,
        content: this.logo(maybeLogoPath),
        translate: {
          dx: options.logo?.dx,
          dy: options.logo?.dy,
        },
      },
    });

    const colorScheme = options.wordmark?.colorScheme;
    if (colorScheme?.dark && colorScheme.light) {
      wordmark.dynamic({
        font: colorScheme?.dark,
      }, {
        font: colorScheme.light,
      });
    } else {
      if (colorScheme?.dark) {
        wordmark.variant('dark', {
          font: colorScheme?.dark,
        });
      }
      if (colorScheme?.light) {
        wordmark.variant('light', {
          font: colorScheme?.light,
        });
      }
    }
  }

  public logo(filePath: string): string | undefined {
    try {
      return readFileSync(filePath).toString().trim();
    } catch {
      return;
    }
  }
}
