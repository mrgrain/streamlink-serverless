import { JsonPatch } from 'projen';
import { NodeProject } from 'projen/lib/javascript';

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
  public constructor(project: NodeProject, options: WorkflowDockerPatchOptions) {
    const {
      workflow,
      workflowName = options.workflow,
    } = options;

    project.tryFindObjectFile(`.github/workflows/${workflow}.yml`)?.patch(
      JsonPatch.add(`/jobs/${workflowName}/steps/`, {
        name: 'Setup Node.js',
        uses: 'actions/setup-node@v3',
        with: { 'node-version': project.minNodeVersion ?? '14.x' },
      }),
      JsonPatch.remove(`/jobs/${workflowName}/container`),
    );
  }
}
