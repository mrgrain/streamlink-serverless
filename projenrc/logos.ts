import { Component, Project } from 'projen';

interface LogosOptions {
  readonly dirName?: string;
}

export class Logos extends Component {
  public constructor(project: Project, options: LogosOptions = {}) {
    super(project);

    const dirName = options.dirName ?? 'images';

    project.addTask('logos:convert', {
      exec: `find ${dirName} -iname "*.svg" | xargs -L1 -I{} sh -c "rsvg-convert -h 1024 {} > ${dirName}/\\$(basename {} .svg).png"`,
    });
  }
}