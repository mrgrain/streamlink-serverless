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
  /**
   * Docker group to add.
   * @default "121"
   */
  dockerGroup?: string;
  /**
   * Path of the volume on host and container.
   * @default "/superchain"
   */
  volumePath?: string;
  /**
   * Relative path to the work dir.
   * @default "work"
   */
  workDir?: string;
  /**
   * Relative path to the tmp dir.
   * @default "tmp"
   */
  tmpDir?: string;
}

export class WorkflowDockerPatch {
  public constructor(project: Project, options: WorkflowDockerPatchOptions) {
    const {
      workflow,
      workflowName = options.workflow,
      dockerGroup = '121',
      volumePath = '/superchain',
    } = options;
    const workDir = `${volumePath}/${options.workDir ?? 'work'}`;
    const tmpDir = `${volumePath}/${options.tmpDir ?? 'tmp'}`;
    const jobPath = `/jobs/${workflowName}`;

    const workflowFile = project.tryFindObjectFile(`.github/workflows/${workflow}.yml`);
    if (!workflowFile) {
      return;
    }

    const patches = [
      JsonPatch.add(jobPath + '/defaults', { run: { 'working-directory': workDir } }),
      JsonPatch.add(jobPath + '/container/options', `--group-add ${dockerGroup}`),
      JsonPatch.add(jobPath + '/container/volumes', [`${volumePath}:${volumePath}`]),
      JsonPatch.add(jobPath + '/env/TMPDIR', tmpDir),
      JsonPatch.add(jobPath + '/steps/1', {
        'name': 'Prepare Workspace',
        'working-directory': volumePath,
        'run': `sudo cp -a $GITHUB_WORKSPACE/. ${workDir}/ && sudo install -d -m 0777 -o superchain -g superchain ${tmpDir}`,
      }),
    ];

    if (workflow === 'build') {
      patches.push(
        JsonPatch.replace(jobPath + '/steps/5/with/path', `${workDir}/.repo.patch`),
        JsonPatch.replace(jobPath + '/steps/8/with/path', `${workDir}/dist`),
      );
    }

    if (workflow === 'release') {
      patches.push(
        JsonPatch.replace(jobPath + '/steps/7/with/path', `${workDir}/dist`),
      );
    }

    workflowFile.patch(...patches);
  }
}
