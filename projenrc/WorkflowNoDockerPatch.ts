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

    project.tryFindObjectFile(`.github/workflows/${workflow}.yml`)?.patch(
      JsonPatch.remove( `/jobs/${workflowName}/container`),
    );
  }
}
