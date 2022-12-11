import { JsonPatch, Project } from 'projen';

export interface WorkflowDockerPatchOptions {
  /**
   * The workflow to patch.
   */
  workflow: 'build' | 'release';
  /**
   * Name of the workflow.
   * @default - same as `workflow`
   */
  workflowName?: string;
}

export class WorkflowNoDockerPatch {
  public constructor(project: Project, options: WorkflowDockerPatchOptions) {
    const {
      workflow,
      workflowName = options.workflow,
    } = options;
    // const workDir = `${volumePath}/${options.workDir ?? 'work'}`;
    // const tmpDir = `${volumePath}/${options.tmpDir ?? 'tmp'}`;
    const jobPath = `/jobs/${workflowName}`;

    const workflowFile = project.tryFindObjectFile(`.github/workflows/${workflow}.yml`);
    if (!workflowFile) {
      return;
    }

    const patches = [
      JsonPatch.remove(jobPath + '/container'),
    ];

    // if (workflow === 'build') {
    //   patches.push(
    //     JsonPatch.replace(jobPath + '/steps/5/with/path', `${workDir}/.repo.patch`),
    //     JsonPatch.replace(jobPath + '/steps/8/with/path', `${workDir}/dist`),
    //   );
    // }

    // if (workflow === 'release') {
    //   patches.push(
    //     JsonPatch.replace(jobPath + '/steps/7/with/path', `${workDir}/dist`),
    //   );
    // }

    workflowFile.patch(...patches);
  }
}
